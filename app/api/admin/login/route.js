export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = () =>
  new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "admin-secret");

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await new SignJWT({ role: "admin", username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("12h")
      .setIssuedAt()
      .sign(SECRET());

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/admin",
    });
    return res;
  } catch (e) {
    console.error("[admin login]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
