"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Brain,
  BarChart3,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Settings } from "lucide-react";


export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Entities", href: "/dashboard/entities", icon: Brain },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside
      className={`h-screen bg-slate-900 text-white transition-all duration-300
      ${collapsed ? "w-[80px]" : "w-[260px]"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <h2 className="text-lg font-bold text-blue-400">Clinical NLP</h2>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg
              ${active ? "bg-slate-800 text-blue-400" : "hover:bg-slate-800"}`}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
<button
  onClick={logout}
  className={`absolute bottom-6 left-0 mx-4
  flex items-center gap-3 px-4 py-2 text-red-400
  hover:bg-slate-800 rounded-lg transition
  ${collapsed ? "justify-center" : ""}`}
>
  <LogOut className="h-5 w-5" />
  {!collapsed && "Logout"}
</button>
  </aside>
  );
}
