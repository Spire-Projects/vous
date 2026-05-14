import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F7F5F2]">
      <AdminSidebar />
      <main className="ml-64 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
