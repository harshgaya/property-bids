export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const trust = searchParams.get("trust") || "";
    const paid = searchParams.get("paid");
    const active = searchParams.get("active");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;

    const col = await getCollection("properties");
    const query = {};
    if (search)
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    if (trust) query.trust = trust;
    if (paid === "true") query.isPaid = true;
    if (paid === "false") query.isPaid = { $ne: true };
    if (active === "true") query.isActive = true;
    if (active === "false") query.isActive = false;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      col
        .find(query, {
          projection: { bids: 0, photos: { $slice: 1 }, description: 0 },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: data.map((d) => ({ ...d, _id: d._id.toString() })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// PATCH — update trust, isPaid, isActive
export async function PATCH(request) {
  try {
    const { id, ...update } = await request.json();
    const col = await getCollection("properties");
    const allowed = {};
    if (update.trust !== undefined) allowed.trust = update.trust;
    if (update.isPaid !== undefined) allowed.isPaid = update.isPaid;
    if (update.isActive !== undefined) allowed.isActive = update.isActive;
    if (update.isVerified !== undefined) allowed.isVerified = update.isVerified;
    allowed.updatedAt = new Date();
    await col.updateOne({ _id: new ObjectId(id) }, { $set: allowed });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
