// src/pages/admin-daerah/DashboardAdminDaerah.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin-page/sidebar";

export default function DashboardAdminDaerah() {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar role="admin-daerah" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}