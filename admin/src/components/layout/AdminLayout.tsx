import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-vous-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <button
        className="fixed top-4 left-4 z-20 lg:hidden bg-vous-text text-white p-2.5 rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      <main className="flex-1 min-h-screen ml-0 lg:ml-64 pt-14 lg:pt-0">
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
