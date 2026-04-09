export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_PRICES = {
  basic: 0, // free
  manual: 249900, // ₹2,499 in paise
  legal: 3000000, // ₹30,000 in paise
};

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const { propertyId } = await request.json();
    if (!propertyId)
      return NextResponse.json(
        { success: false, message: "Property ID required" },
        { status: 400 },
      );

    const col = await getCollection("properties");
    const property = await col.findOne({
      _id: new ObjectId(propertyId),
      ownerId: userId,
    });
    if (!property)
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 },
      );
    if (property.isPaid)
      return NextResponse.json(
        { success: false, message: "Already paid" },
        { status: 400 },
      );

    const amount = PLAN_PRICES[property.plan];
    if (!amount) {
      // Basic plan is free — just mark as paid
      await col.updateOne(
        { _id: new ObjectId(propertyId) },
        { $set: { isPaid: true, updatedAt: new Date() } },
      );
      return NextResponse.json({ success: true, free: true });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      notes: { propertyId, userId, plan: property.plan },
    });

    // Store pending payment in DB
    const payments = await getCollection("payments");
    await payments.insertOne({
      type: "listing",
      propertyId: new ObjectId(propertyId),
      userId,
      plan: property.plan,
      amount,
      razorpayOrderId: order.id,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: property.plan,
      propertyTitle: property.title,
    });
  } catch (e) {
    console.error("[listing create-order]", e);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 },
    );
  }
}
