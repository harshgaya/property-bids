export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const TEST_ACCOUNTS = {
  9999999999: "123456",
  8888888888: "000000",
  7777777777: "111111",
};

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone))
      return NextResponse.json(
        {
          success: false,
          message: "Valid 10-digit Indian mobile number required",
        },
        { status: 400 },
      );

    const col = await getCollection("users");
    const isTest = TEST_ACCOUNTS[phone];

    if (isTest) {
      await col.updateOne(
        { phone },
        {
          $set: { updatedAt: new Date() },
          $setOnInsert: {
            phone,
            role: "user",
            createdAt: new Date(),
            totalBids: 0,
            totalListings: 0,
          },
        },
        { upsert: true },
      );
      return NextResponse.json({
        success: true,
        sessionId: "test",
        isTest: true,
        otp: TEST_ACCOUNTS[phone],
      });
    }

    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_TOKEN}/SMS/+91${phone}/AUTOGEN/otp_template`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Status !== "Success")
      return NextResponse.json(
        { success: false, message: "Failed to send OTP" },
        { status: 500 },
      );

    await col.updateOne(
      { phone },
      {
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          phone,
          role: "user",
          createdAt: new Date(),
          totalBids: 0,
          totalListings: 0,
        },
      },
      { upsert: true },
    );

    // Return sessionId to client — stored in useState, sent back with verify request
    return NextResponse.json({ success: true, sessionId: data.Details });
  } catch (e) {
    console.error("[send-otp]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
