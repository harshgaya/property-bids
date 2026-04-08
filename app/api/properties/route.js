export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const col = await getCollection("properties");
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const trust = searchParams.get("trust");
    const city = searchParams.get("city");
    const facing = searchParams.get("facing");
    const tags = searchParams.get("tags");
    const budMin = searchParams.get("budMin");
    const budMax = searchParams.get("budMax");
    const sftMin = searchParams.get("sftMin");
    const sftMax = searchParams.get("sftMax");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "18"));
    const swLng = parseFloat(searchParams.get("swLng"));
    const swLat = parseFloat(searchParams.get("swLat"));
    const neLng = parseFloat(searchParams.get("neLng"));
    const neLat = parseFloat(searchParams.get("neLat"));

    const query = { isActive: true };
    if (type && type !== "all") query.type = type;
    if (trust) query.trust = { $in: trust.split(",") };
    if (city) query["address.city"] = { $regex: city, $options: "i" };
    if (facing) query.facing = { $in: facing.split(",") };
    if (tags) query.tags = { $all: tags.split(",") };
    if (budMin || budMax) {
      query.price = {};
      if (budMin) query.price.$gte = parseFloat(budMin) * 100000;
      if (budMax) query.price.$lte = parseFloat(budMax) * 100000;
    }
    if (sftMin || sftMax) {
      query["fields.sft"] = {};
      if (sftMin) query["fields.sft"].$gte = parseInt(sftMin);
      if (sftMax) query["fields.sft"].$lte = parseInt(sftMax);
    }
    if (!isNaN(swLng) && !isNaN(swLat) && !isNaN(neLng) && !isNaN(neLat)) {
      query.location = {
        $geoWithin: {
          $box: [
            [swLng, swLat],
            [neLng, neLat],
          ],
        },
      };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      col
        .find(query, { projection: { bids: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET /api/properties]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const col = await getCollection("properties");
    const body = await request.json();

    // Convert location from { lat, lng, address } to GeoJSON for 2dsphere index
    // If user didn't pin location, store null
    let location = null;
    if (body.location?.lat && body.location?.lng) {
      location = {
        type: "Point",
        coordinates: [body.location.lng, body.location.lat], // MongoDB: [longitude, latitude]
        address: body.location.address || "",
      };
    }

    const doc = {
      type: body.type,
      title: body.title,
      price: body.price,
      priceLabel: body.priceLabel,
      facing: body.facing,
      tags: body.tags || [],
      plan: body.plan,
      address: body.address,
      fields: body.fields || {},
      photos: body.photos || [],
      documents: body.documents || [],
      location, // GeoJSON or null
      trust: body.trust || "basic",
      isActive: true,
      isVerified: false,
      ownerId: userId,
      bids: [],
      bidCount: 0,
      isPaid: false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);
    return NextResponse.json(
      { success: true, data: { ...doc, _id: result.insertedId } },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/properties]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
