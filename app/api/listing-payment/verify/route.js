export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";

function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const {
      propertyId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json();

    // 1. Verify signature
    if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature))
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed — invalid signature",
        },
        { status: 400 },
      );

    const payments = await getCollection("payments");
    const props = await getCollection("properties");

    // 2. Find the pending payment record
    const payment = await payments.findOne({
      razorpayOrderId,
      status: "pending",
    });
    if (!payment)
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 },
      );

    // 3. Check it belongs to this user
    if (payment.userId !== userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );

    // 4. Mark payment as captured
    await payments.updateOne(
      { razorpayOrderId },
      {
        $set: {
          status: "captured",
          razorpayPaymentId,
          razorpaySignature,
          capturedAt: new Date(),
        },
      },
    );

    // 5. Mark property as paid
    await props.updateOne(
      { _id: new ObjectId(propertyId), ownerId: userId },
      {
        $set: {
          isPaid: true,
          razorpayPaymentId,
          razorpayOrderId,
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified. Your listing is now live!",
    });
  } catch (e) {
    console.error("[listing verify]", e);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  }
}
