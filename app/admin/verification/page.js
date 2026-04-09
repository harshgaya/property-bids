import { requireAdmin } from "@/lib/adminAuth";
import AdminVerification from "./Adminverification";

export default async function Page() {
  await requireAdmin();
  return <AdminVerification />;
}
