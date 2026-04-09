import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — PropertyBids" };

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="ml-56">{children}</div>
    </div>
  );
}
