import { requireAdmin } from "@/lib/adminAuth";
import AdminDashboard from "./Admindashboard";

export default async function DashboardPage() {
  await requireAdmin();
  return <AdminDashboard />;
}
