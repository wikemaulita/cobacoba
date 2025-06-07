// src/components/admin-page/sidebar.jsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  Map,
  MapPin,
  Landmark,
  Calendar,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItemsSuperAdmin = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/super-admin/dashboard",
    },
    {
      id: "account-requests",
      label: "Account Requests",
      icon: <Users className="h-5 w-5" />,
      path: "/super-admin/account-requests",
    },
    {
      id: "provinces",
      label: "Provinces",
      icon: <Map className="h-5 w-5" />,
      path: "/super-admin/provinces",
    },
    {
      id: "regions",
      label: "Regions",
      icon: <MapPin className="h-5 w-5" />,
      path: "/super-admin/regions",
    },
    {
      id: "cultures",
      label: "Cultures",
      icon: <Landmark className="h-5 w-5" />,
      path: "/super-admin/cultures",
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar className="h-5 w-5" />,
      path: "/super-admin/events",
    },
  ];

  const menuItemsAdminDaerah = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/admin-daerah/dashboard",
    },
    {
      id: "provinces",
      label: "Provinces",
      icon: <Map className="h-5 w-5" />,
      path: "/admin-daerah/provinces",
    },
    {
      id: "cultures",
      label: "Cultures",
      icon: <Landmark className="h-5 w-5" />,
      path: "/admin-daerah/cultures",
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar className="h-5 w-5" />,
      path: "/admin-daerah/events",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={cn(
        "bg-slate-800 text-slate-200 border-r border-slate-700 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b border-slate-700 flex items-center justify-between h-16">
        {!collapsed && (
          <h1 className="font-bold text-xl text-white">
            {user
              ? user.role === "SUPER_ADMIN"
                ? "Super Admin"
                : user.role === "ADMIN_DAERAH"
                  ? "Admin Daerah"
                  : null
              : "Admin Panel"}
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {user && (
            (user.role === "SUPER_ADMIN"
              ? menuItemsSuperAdmin
              : user.role === "ADMIN_DAERAH"
                ? menuItemsAdminDaerah
                : []
            ).map((item) => (
                <Button
                  key={item.id}
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start mb-1 text-slate-300 hover:bg-slate-700 hover:text-white", 
                    isActive(item.path) && "bg-blue-600 text-white hover:bg-blue-500", 
                    collapsed ? "px-3" : "px-4"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              ))
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-slate-600 text-white">
              {user ? user.username.charAt(0).toUpperCase() : "AD"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user
                  ? user.username
                  : role === "super-admin"
                    ? "Super Admin"
                    : "Admin Daerah"}
              </p>
              <p className="text-xs text-slate-400">{user ? user.email : "admin@example.com"}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start mt-4 text-slate-300 hover:bg-slate-700 hover:text-white", // PERUBAHAN: Style tombol logout
            collapsed ? "px-3" : "px-4"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
