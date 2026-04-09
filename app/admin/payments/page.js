import { requireAdmin } from "@/lib/adminAuth";
import AdminPayments from "./Adminpayments";
export default async function Page() {
  await requireAdmin();
  return <AdminPayments />;
}
