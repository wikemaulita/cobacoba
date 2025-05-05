import UserSidebar from "@/components/user/sidebar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex h-full bg-background">
      <UserSidebar />
      <div className="flex-1 overflow-auto p-6">
        <Outlet /> {/* Child routes will render here */}
      </div>
    </div>
  );
}
