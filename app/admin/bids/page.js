import { requireAdmin } from "@/lib/adminAuth";
import AdminBids from "./Adminbids";
export default async function Page() {
  await requireAdmin();
  return <AdminBids />;
}
