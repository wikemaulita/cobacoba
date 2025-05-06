import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin-page/sidebar";

export default function DashboardAdminDaerah() {
  return (
    <div className="flex h-full bg-background">
      <Sidebar role="admin-daerah" />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
