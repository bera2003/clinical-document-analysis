"use client";

import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { token, loading } = useAuth();
  const router = useRouter();

  // 🔐 Protect ALL dashboard routes
  useEffect(() => {
    if (!loading && !token) {
      router.replace("/"); // or "/" if you prefer landing
    }
  }, [token, loading, router]);

  // Prevent UI flash
  if (loading || !token) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="h-screen sticky top-0 overflow-hidden">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          {children}
        </main>

      </div>
    </SidebarProvider>
  );
}
