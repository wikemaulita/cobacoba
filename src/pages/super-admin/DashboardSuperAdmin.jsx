import Sidebar from "@/components/admin-page/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardSuperAdmin() {
  return (
    <div className="flex h-full bg-background">
      <Sidebar role="super-admin" />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
