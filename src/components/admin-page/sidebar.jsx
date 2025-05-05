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
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
  const { toast } = useToast();
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
    toast({
      title: "Logging out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <h1 className="font-bold text-xl">
            {role === "super-admin"
              ? "Super Admin"
              : role === "admin-daerah"
                ? "Admin Daerah"
                : null}
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {role === "super-admin"
            ? menuItemsSuperAdmin.map((item) => (
                <Button
                  key={item.id}
                  variant={
                    location.pathname === item.path ? "secondary" : "ghost"
                  }
                  className={cn(
                    "w-full justify-start mb-1",
                    collapsed ? "px-3" : "px-4"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              ))
            : role === "admin-daerah"
              ? menuItemsAdminDaerah.map((item) => (
                  <Button
                    key={item.id}
                    variant={
                      location.pathname === item.path ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start mb-1",
                      collapsed ? "px-3" : "px-4"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                ))
              : null}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">
                {role === "super-admin"
                  ? "Super Admin"
                  : role === "admin-daerah"
                    ? "Admin Daerah"
                    : null}
              </p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start mt-4",
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
