export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import crypto from "crypto";

function maskPhone(phone) {
  if (!phone) return "••••••••••";
  return phone.replace(/(\d{2})\d{6}(\d{2})/, "$1••••••$2");
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

// POST /api/bids — record bid after successful payment
export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    const phone = request.headers.get("x-user-phone");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 },
      );

    const {
      propertyId,
      amount,
      message,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json();

    // Verify Razorpay payment signature
    if (
      !verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      )
    )
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 },
      );

    const props = await getCollection("properties");
    const bidsCol = await getCollection("bids");

    let propId;
    try {
      propId = new ObjectId(propertyId);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid property" },
        { status: 400 },
      );
    }

    const property = await props.findOne({ _id: propId });
    if (!property)
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 },
      );
    if (!property.isActive)
      return NextResponse.json(
        { success: false, message: "Property is no longer active" },
        { status: 400 },
      );

    // Cannot bid on own property
    if (property.ownerId === userId)
      return NextResponse.json(
        { success: false, message: "You cannot bid on your own property" },
        { status: 400 },
      );

    // Cannot bid twice
    const existing = await bidsCol.findOne({
      propertyId: propId,
      bidderId: userId,
    });
    if (existing)
      return NextResponse.json(
        {
          success: false,
          message: "You have already placed a bid on this property",
        },
        { status: 400 },
      );

    // Cannot bid if another bid is accepted
    const accepted = await bidsCol.findOne({
      propertyId: propId,
      status: "accepted",
    });
    if (accepted)
      return NextResponse.json(
        {
          success: false,
          message: "This property already has an accepted bid",
        },
        { status: 400 },
      );

    const bid = {
      propertyId: propId,
      bidderId: userId,
      bidderPhone: maskPhone(phone),
      amount: parseFloat(amount) * 100000, // convert from lakhs
      message: message || "",
      status: "pending",
      razorpayOrderId,
      razorpayPaymentId,
      bidFee: 99,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    const result = await bidsCol.insertOne(bid);

    // Update property bid count
    await props.updateOne(
      { _id: propId },
      { $inc: { bidCount: 1 }, $set: { updatedAt: new Date() } },
    );

    return NextResponse.json(
      { success: true, data: { ...bid, _id: result.insertedId } },
      { status: 201 },
    );
  } catch (e) {
    console.error("[POST /api/bids]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// GET /api/bids?propertyId=xxx — get bids for a property (owner only)
export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    const bidsCol = await getCollection("bids");
    const props = await getCollection("properties");

    let propId;
    try {
      propId = new ObjectId(propertyId);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid property" },
        { status: 400 },
      );
    }

    // Verify ownership
    const property = await props.findOne({ _id: propId, ownerId: userId });
    if (!property)
      return NextResponse.json(
        { success: false, message: "Not found or unauthorized" },
        { status: 404 },
      );

    const bids = await bidsCol
      .find({ propertyId: propId })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, data: bids });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
