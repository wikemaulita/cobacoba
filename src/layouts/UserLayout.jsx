import { Helmet } from "react-helmet";
import UserSidebar from "@/components/user/sidebar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <Helmet>
        <link rel="icon" href="/JB.svg" type="image/svg+xml" />
      </Helmet>

      <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
        <UserSidebar />
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </>
  );
}
