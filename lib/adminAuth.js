import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET = () =>
  new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "admin-secret");

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  try {
    const { payload } = await jwtVerify(token, SECRET());
    return payload;
  } catch {
    redirect("/admin/login");
  }
}
