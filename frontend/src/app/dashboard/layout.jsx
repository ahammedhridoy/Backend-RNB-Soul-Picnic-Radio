import DashSidebar from "@/components/DashSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <aside className="w-64 text-white bg-gray-800">
        <DashSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto bg-gray-100">{children}</main>
    </div>
  );
}
