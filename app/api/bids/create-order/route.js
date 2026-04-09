export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    const phone = request.headers.get("x-user-phone") || "";

    if (!userId)
      return NextResponse.json(
        { success: false, message: "Login required to place a bid" },
        { status: 401 },
      );

    const { propertyId } = await request.json();
    if (!propertyId)
      return NextResponse.json(
        { success: false, message: "Property ID required" },
        { status: 400 },
      );

    const order = await razorpay.orders.create({
      amount: 9900,
      currency: "INR",
      notes: { propertyId, userId, phone },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e) {
    console.error("[create-order]", e);
    return NextResponse.json(
      { success: false, message: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
