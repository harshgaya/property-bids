import { requireAdmin } from "@/lib/adminAuth";
import AdminProperties from "./AdminProperties";
export default async function Page() {
  await requireAdmin();
  return <AdminProperties />;
}
