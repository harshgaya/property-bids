export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { signToken, setAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phone, otp, sessionId } = await request.json();

    if (!phone || !otp || !sessionId)
      return NextResponse.json(
        { success: false, message: "phone, otp and sessionId required" },
        { status: 400 },
      );

    let isValid = false;

    if (sessionId === "test") {
      // Test account
      const TEST_ACCOUNTS = {
        9999999999: "123456",
        8888888888: "000000",
        7777777777: "111111",
      };
      isValid = TEST_ACCOUNTS[phone] === otp;
    } else {
      // Verify with 2factor using sessionId from client
      const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_TOKEN}/SMS/VERIFY/${sessionId}/${otp}`;
      const res = await fetch(url);
      const data = await res.json();
      isValid = data.Status === "Success";
    }

    if (!isValid)
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 401 },
      );

    const col = await getCollection("users");
    const user = await col.findOne({ phone });

    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );

    const token = await signToken({
      userId: user._id.toString(),
      phone,
      role: user.role,
    });
    const res = NextResponse.json({
      success: true,
      user: { _id: user._id, phone, name: user.name, role: user.role },
    });
    return setAuthCookie(res, token);
  } catch (e) {
    console.error("[verify-otp]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
