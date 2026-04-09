export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "listing"; // listing | bid
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;
    const skip = (page - 1) * limit;

    if (type === "bid") {
      const col = await getCollection("bids");
      const [data, total] = await Promise.all([
        col
          .aggregate([
            { $match: { razorpayPaymentId: { $exists: true } } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
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
              $addFields: {
                propertyTitle: { $arrayElemAt: ["$prop.title", 0] },
              },
            },
            { $project: { prop: 0 } },
          ])
          .toArray(),
        col.countDocuments({ razorpayPaymentId: { $exists: true } }),
      ]);
      return NextResponse.json({
        success: true,
        data: data.map((d) => ({
          ...d,
          _id: d._id.toString(),
          propertyId: d.propertyId?.toString(),
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        totalRevenue: total * 99,
      });
    } else {
      const col = await getCollection("properties");
      const [data, total] = await Promise.all([
        col
          .find(
            { isPaid: true },
            {
              projection: {
                title: 1,
                plan: 1,
                priceLabel: 1,
                address: 1,
                createdAt: 1,
                razorpayPaymentId: 1,
              },
            },
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        col.countDocuments({ isPaid: true }),
      ]);
      return NextResponse.json({
        success: true,
        data: data.map((d) => ({ ...d, _id: d._id.toString() })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
