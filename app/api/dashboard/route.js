export const dynamic = "force-dynamic";

import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const col = await getCollection("properties");

    // My listings
    const listings = await col
      .find({ ownerId: userId }, { projection: { bids: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    // Bids on my listings — fetch separately to include bid details
    const listingIds = listings.map((l) => l._id);
    const withBids =
      listingIds.length > 0
        ? await col
            .find(
              { _id: { $in: listingIds } },
              { projection: { title: 1, priceLabel: 1, bids: 1, isPaid: 1 } },
            )
            .toArray()
        : [];

    const incomingBids = withBids
      .flatMap((l) =>
        (l.bids || []).map((b) => ({
          ...b,
          propertyId: l._id,
          propertyTitle: l.title,
          propertyPrice: l.priceLabel,
        })),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Bids I placed (as buyer) — search all properties for my bids
    const myPlacedBids = await col
      .find(
        { "bids.bidderId": userId },
        { projection: { title: 1, priceLabel: 1, address: 1, "bids.$": 1 } },
      )
      .toArray();

    const placedBids = myPlacedBids.map((p) => ({
      propertyId: p._id,
      propertyTitle: p.title,
      propertyPrice: p.priceLabel,
      city: p.address?.city,
      bid: p.bids?.[0],
    }));

    // Stats
    const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);
    const acceptedBids = incomingBids.filter(
      (b) => b.status === "accepted",
    ).length;

    return NextResponse.json({
      success: true,
      listings,
      incomingBids,
      placedBids,
      stats: {
        listings: listings.length,
        incomingBids: incomingBids.length,
        totalViews,
        acceptedBids,
      },
    });
  } catch (e) {
    console.error("[dashboard]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
