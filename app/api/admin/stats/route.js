export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const props = await getCollection("properties");
    const users = await getCollection("users");
    const bidsCol = await getCollection("bids");

    const now = new Date();
    const week = new Date(now - 7 * 864e5);

    const [
      totalProperties,
      newPropertiesWeek,
      totalUsers,
      newUsersWeek,
      totalBids,
      pendingVerification,
      paidListings,
      totalRevenue,
      recentListings,
      recentBids,
      byType,
      byDay,
    ] = await Promise.all([
      props.countDocuments({}),
      props.countDocuments({ createdAt: { $gte: week } }),
      users.countDocuments({}),
      users.countDocuments({ createdAt: { $gte: week } }),
      bidsCol.countDocuments({}),
      props.countDocuments({
        trust: { $in: ["manual", "legal"] },
        isVerified: false,
        isActive: true,
      }),
      props.countDocuments({ isPaid: true }),
      bidsCol
        .countDocuments({ status: { $ne: "withdrawn" } })
        .then((n) => n * 99),
      props
        .find(
          {},
          {
            projection: {
              title: 1,
              type: 1,
              trust: 1,
              isPaid: 1,
              isVerified: 1,
              address: 1,
              priceLabel: 1,
              bidCount: 1,
              createdAt: 1,
              ownerId: 1,
            },
          },
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      bidsCol
        .aggregate([
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "properties",
              localField: "propertyId",
              foreignField: "_id",
              as: "prop",
              pipeline: [{ $project: { title: 1 } }],
            },
          },
          {
            $addFields: { propertyTitle: { $arrayElemAt: ["$prop.title", 0] } },
          },
          { $project: { prop: 0 } },
        ])
        .toArray(),
      props
        .aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      props
        .aggregate([
          { $match: { createdAt: { $gte: week } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProperties,
        newPropertiesWeek,
        totalUsers,
        newUsersWeek,
        totalBids,
        pendingVerification,
        paidListings,
        totalRevenue,
      },
      recentListings: recentListings.map((l) => ({
        ...l,
        _id: l._id.toString(),
      })),
      recentBids: recentBids.map((b) => ({
        ...b,
        _id: b._id.toString(),
        propertyId: b.propertyId?.toString(),
      })),
      byType,
      byDay,
    });
  } catch (e) {
    console.error("[admin stats]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
