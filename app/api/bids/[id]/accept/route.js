export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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
    const props = await getCollection("properties");

    let bidId;
    try {
      bidId = new ObjectId(params.id);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid bid" },
        { status: 400 },
      );
    }

    const bid = await bidsCol.findOne({ _id: bidId });
    if (!bid)
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 },
      );

    // Verify the property belongs to this user
    const property = await props.findOne({
      _id: bid.propertyId,
      ownerId: userId,
    });
    if (!property)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );

    // Accept this bid
    await bidsCol.updateOne(
      { _id: bidId },
      { $set: { status: "accepted", acceptedAt: new Date() } },
    );

    // Reject all other bids on this property
    await bidsCol.updateMany(
      { propertyId: bid.propertyId, _id: { $ne: bidId } },
      { $set: { status: "rejected", rejectedAt: new Date() } },
    );

    return NextResponse.json({ success: true, message: "Bid accepted" });
  } catch (e) {
    console.error("[accept bid]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
