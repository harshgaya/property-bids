import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "change-this-in-production",
  );
const ADMIN_SECRET = () =>
  new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "admin-secret");

const PROTECTED_PAGES = ["/post-property", "/dashboard"];
const PROTECTED_APIS = [
  "/api/properties",
  "/api/bids",
  "/api/dashboard",
  "/api/listing-payment",
];

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET());
    return payload;
  } catch {
    return null;
  }
}

function withUser(request, payload) {
  const headers = new Headers(request.headers);
  headers.set("x-user-id", payload.userId);
  headers.set("x-user-phone", payload.phone);
  headers.set("x-user-role", payload.role);
  return NextResponse.next({ request: { headers } });
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get("pb_token")?.value;

  // ── Admin pages ──────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(adminToken, ADMIN_SECRET());
    } catch {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.set("admin_token", "", { maxAge: 0, path: "/admin" });
      return res;
    }
    return NextResponse.next();
  }

  // ── Protected pages ───────────────────────────────────────────────────────
  if (PROTECTED_PAGES.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const payload = await verifyToken(token);
    if (!payload) {
      const url = new URL("/login", request.url);
      const res = NextResponse.redirect(url);
      res.cookies.set("pb_token", "", { maxAge: 0, path: "/" });
      return res;
    }
    return withUser(request, payload);
  }

  // ── Protected APIs (POST only) ────────────────────────────────────────────
  // Dashboard needs auth on GET too
  const isDashboardAPI = pathname.startsWith("/api/dashboard");
  const isPropertyPatch =
    method === "PATCH" && pathname.startsWith("/api/properties");
  const isBidsRoute = pathname.startsWith("/api/bids") && method !== "GET";
  if (
    (method === "POST" && PROTECTED_APIS.some((p) => pathname.startsWith(p))) ||
    isDashboardAPI ||
    isPropertyPatch ||
    isBidsRoute
  ) {
    if (!token)
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    const payload = await verifyToken(token);
    if (!payload)
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 },
      );
    return withUser(request, payload);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/post-property/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/properties/:path*",
    "/api/bids/:path*",
    "/api/dashboard",
    "/api/admin/:path*",
    "/api/listing-payment/:path*",
  ],
};
