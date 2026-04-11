export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "change-this-in-production",
  );

export async function GET(request) {
  try {
    // Read token directly — middleware doesn't inject headers for GET /api/bids/*
    const cookieStore = await cookies();
    const token = cookieStore.get("pb_token")?.value;
    if (!token) return NextResponse.json({ hasBid: false });

    const { payload } = await jwtVerify(token, SECRET());
    const userId = payload.userId;
    if (!userId) return NextResponse.json({ hasBid: false });

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    if (!propertyId) return NextResponse.json({ hasBid: false });

    const col = await getCollection("bids");
    const bid = await col.findOne({
      propertyId: new ObjectId(propertyId),
      bidderId: userId,
      status: { $nin: ["withdrawn"] },
    });

    return NextResponse.json({ hasBid: !!bid });
  } catch {
    return NextResponse.json({ hasBid: false });
  }
}
