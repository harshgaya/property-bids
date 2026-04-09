import { requireAdmin } from "@/lib/adminAuth";
import AdminUsers from "./Adminusers";

export default async function Page() {
  await requireAdmin();
  return <AdminUsers />;
}
