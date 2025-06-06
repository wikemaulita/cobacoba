// src/pages/super-admin/DashboardSuperAdmin.jsx
import Sidebar from "@/components/admin-page/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardSuperAdmin() {
  return (
    // PERUBAHAN: Latar belakang utama menjadi abu-abu muda
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar role="super-admin" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}