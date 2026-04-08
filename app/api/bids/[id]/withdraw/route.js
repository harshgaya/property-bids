export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Buyer can withdraw bid within 2 hours of placing
export async function POST(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const bidsCol = await getCollection("bids");

    let bidId;
    try {
      bidId = new ObjectId(params.id);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid bid" },
        { status: 400 },
      );
    }

    const bid = await bidsCol.findOne({ _id: bidId, bidderId: userId });
    if (!bid)
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 },
      );

    if (bid.status !== "pending")
      return NextResponse.json(
        { success: false, message: `Cannot withdraw a ${bid.status} bid` },
        { status: 400 },
      );

    // Only allow within 2 hours
    const hoursElapsed =
      (Date.now() - new Date(bid.createdAt)) / (1000 * 60 * 60);
    if (hoursElapsed > 2)
      return NextResponse.json(
        {
          success: false,
          message: "Bids can only be withdrawn within 2 hours of placing",
        },
        { status: 400 },
      );

    await bidsCol.updateOne(
      { _id: bidId },
      { $set: { status: "withdrawn", withdrawnAt: new Date() } },
    );

    // Decrement bid count on property
    const props = await getCollection("properties");
    await props.updateOne({ _id: bid.propertyId }, { $inc: { bidCount: -1 } });

    return NextResponse.json({ success: true, message: "Bid withdrawn" });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
