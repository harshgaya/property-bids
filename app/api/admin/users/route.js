export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;
    const col = await getCollection("users");
    const props = await getCollection("properties");
    const bids = await getCollection("bids");

    const query = {};
    if (search) query.phone = { $regex: search };

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      col
        .find(query, { projection: { otp: 0, otpExpiry: 0, sessionId: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(query),
    ]);

    // Get listing + bid counts per user
    const ids = users.map((u) => u._id.toString());
    const [listingCounts, bidCounts] = await Promise.all([
      props
        .aggregate([
          { $match: { ownerId: { $in: ids } } },
          { $group: { _id: "$ownerId", count: { $sum: 1 } } },
        ])
        .toArray(),
      bids
        .aggregate([
          { $match: { bidderId: { $in: ids } } },
          { $group: { _id: "$bidderId", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

    const lcMap = Object.fromEntries(
      listingCounts.map((l) => [l._id, l.count]),
    );
    const bcMap = Object.fromEntries(bidCounts.map((b) => [b._id, b.count]));

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        ...u,
        _id: u._id.toString(),
        listingCount: lcMap[u._id.toString()] || 0,
        bidCount: bcMap[u._id.toString()] || 0,
      })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// PATCH — ban/unban user
export async function PATCH(request) {
  try {
    const { id, isBanned } = await request.json();
    const col = await getCollection("users");
    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isBanned, updatedAt: new Date() } },
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
