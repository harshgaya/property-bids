export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;
    const col = await getCollection("bids");

    const match = {};
    if (status) match.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      col
        .aggregate([
          { $match: match },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "properties",
              localField: "propertyId",
              foreignField: "_id",
              as: "prop",
              pipeline: [{ $project: { title: 1, priceLabel: 1 } }],
            },
          },
          {
            $addFields: { propertyTitle: { $arrayElemAt: ["$prop.title", 0] } },
          },
          { $project: { prop: 0 } },
        ])
        .toArray(),
      col.countDocuments(match),
    ]);

    return NextResponse.json({
      success: true,
      data: data.map((b) => ({
        ...b,
        _id: b._id.toString(),
        propertyId: b.propertyId?.toString(),
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
