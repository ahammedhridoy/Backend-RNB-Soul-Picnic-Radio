import DashSidebar from "@/components/DashSidebar";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/hooks/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen ">
        {/* Sidebar */}
        <aside className="w-64 text-white bg-gray-800">
          <DashSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <Navigation />
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
