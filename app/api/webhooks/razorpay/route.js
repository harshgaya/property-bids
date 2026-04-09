export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";

function verifyWebhookSignature(body, signature) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

function maskPhone(phone) {
  if (!phone) return "••••••••••";
  return phone.replace(/(\d{2})\d{6}(\d{2})/, "$1••••••$2");
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // 1. Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("[webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const webhooks = await getCollection("webhooks");

    // 2. Store raw event for audit trail
    await webhooks.insertOne({
      event: event.event,
      payload: event,
      receivedAt: new Date(),
      processed: false,
    });

    const payments = await getCollection("payments");
    const props = await getCollection("properties");
    const bidsCol = await getCollection("bids");

    // 3. Handle payment.captured
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const notes = payment.notes || {};

      // ── Listing payment ──────────────────────────────────────────────────
      const listingPayment = await payments.findOne({
        razorpayOrderId: orderId,
        type: "listing",
      });

      if (listingPayment && listingPayment.status !== "captured") {
        await payments.updateOne(
          { razorpayOrderId: orderId },
          {
            $set: {
              status: "captured",
              razorpayPaymentId: payment.id,
              capturedAt: new Date(),
              webhookProcessed: true,
            },
          },
        );
        await props.updateOne(
          { _id: listingPayment.propertyId },
          {
            $set: {
              isPaid: true,
              razorpayPaymentId: payment.id,
              razorpayOrderId: orderId,
              paidAt: new Date(),
              updatedAt: new Date(),
            },
          },
        );
        console.log(`[webhook] Listing paid: ${listingPayment.propertyId}`);
      }

      // ── Bid payment ───────────────────────────────────────────────────────
      // Check if bid was already recorded by frontend (normal flow)
      const existingBid = await bidsCol.findOne({ razorpayOrderId: orderId });

      if (!existingBid && notes.propertyId && notes.userId) {
        // Frontend failed — record bid from webhook data
        let propId;
        try {
          propId = new ObjectId(notes.propertyId);
        } catch {
          propId = null;
        }

        if (propId) {
          const property = await props.findOne({ _id: propId });

          if (property && property.ownerId !== notes.userId) {
            // Check not already bidded
            const alreadyBid = await bidsCol.findOne({
              propertyId: propId,
              bidderId: notes.userId,
            });

            if (!alreadyBid) {
              await bidsCol.insertOne({
                propertyId: propId,
                bidderId: notes.userId,
                bidderPhone: maskPhone(notes.phone || ""),
                amount: parseFloat(notes.amount || 0) * 100000,
                message: "",
                status: "pending",
                razorpayOrderId: orderId,
                razorpayPaymentId: payment.id,
                bidFee: 99,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                recordedByWebhook: true,
              });
              await props.updateOne(
                { _id: propId },
                { $inc: { bidCount: 1 }, $set: { updatedAt: new Date() } },
              );
              console.log(
                `[webhook] Bid recorded for property ${notes.propertyId}`,
              );
            }
          }
        }
      }

      // Mark webhook processed
      await webhooks.updateOne(
        { "payload.payload.payment.entity.order_id": orderId },
        { $set: { processed: true, processedAt: new Date() } },
      );
    }

    // 4. Handle payment.failed
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      await payments.updateOne(
        { razorpayOrderId: orderId },
        {
          $set: {
            status: "failed",
            failedAt: new Date(),
            failureReason: payment.error_description,
          },
        },
      );
    }

    // Always return 200 — prevent Razorpay retries
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[webhook error]", e);
    return NextResponse.json({ success: true }); // still 200
  }
}
