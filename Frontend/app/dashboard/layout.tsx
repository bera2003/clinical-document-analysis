"use client";

import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar - fixed */}
        <aside className="h-screen sticky top-0 overflow-hidden">
          <Sidebar />
        </aside>

        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          {children}
        </main>

      </div>
    </SidebarProvider>
  );
}
