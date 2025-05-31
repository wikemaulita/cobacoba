// src/components/user/sidebar.jsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  Map,
  MapPin,
  Landmark,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/hooks/use-toast"; // useToast diimpor di AuthContext
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

export default function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  // const { toast } = useToast(); // Tidak perlu lagi diimpor di sini
  const { user, logout } = useAuth(); // Gunakan useAuth hook
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/user/dashboard",
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar className="h-5 w-5" />,
      path: "/user/events",
    },
    {
      id: "provinces",
      label: "Provinces",
      icon: <Map className="h-5 w-5" />,
      path: "/user/provinces",
    },
    {
      id: "cultures",
      label: "Cultural Exhibitions",
      icon: <Landmark className="h-5 w-5" />,
      path: "/user/cultures",
    },
  ];

  // Fungsi handleLogout sekarang memanggil fungsi logout dari AuthContext
  const handleLogout = () => {
    logout(); //
    // navigate("/"); // Navigasi sudah dihandle di AuthContext
  };

  const isActive = (path) => {
    if (path === "/user" && pathname === "/user") {
      return true;
    }
    if (path !== "/user" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <h1 className="font-bold text-xl">Cultural Hub</h1>}
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
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                collapsed ? "px-3" : "px-4"
              )}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              {user ? user.username.charAt(0).toUpperCase() : "U"} {/* Tampilkan inisial user */}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">{user ? user.username : "User Name"}</p> {/* Tampilkan username */}
              <p className="text-xs text-muted-foreground">{user ? user.email : "user@example.com"}</p> {/* Tampilkan email */}
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