import { useLocation, useNavigate } from "react-router-dom";
import { Sun, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSiteConfig } from "../../hooks/useSiteConfig";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/pedidos": "Ventas",
  "/inventario": "Inventario",
  "/categorias": "Categorías",
  "/ropa": "Ropa",
  "/usuarios": "Usuarios",
  "/mayoristas": "Mayoristas",
  "/soporte": "Soporte",
  "/contenido": "Contenido",
  "/asesoria": "Asesoría",
  "/landing": "Landing",
  "/descuentos": "Descuentos",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
  "/mapa": "Mapa de Bolivia",
};

interface AdminTopNavProps {
  onOpenSidebar: () => void;
}

export function AdminTopNav({ onOpenSidebar }: AdminTopNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useSiteConfig();

  const currentPath = location.pathname;
  const pageTitle = ROUTE_TITLES[currentPath] ?? "Admin Panel";

  const displayName =
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Administrador");

  const initials =
    user?.name
      ? user.name
          .split(" ")
          .filter(Boolean)
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : user?.email
        ? user.email.substring(0, 2).toUpperCase()
        : "AD";

  const subtext =
    config?.storeName ? `${config.storeName} Admin` : "Administrador General";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {pageTitle}
        </h2>
      </div>

      {/* Right: Theme button, User Profile Card & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Light / Dark Mode Toggle placeholder */}
        <button
          type="button"
          title="Modo claro activo"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <Sun size={18} />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">{subtext}</p>
          </div>

          <div
            className="w-8 h-8 rounded-full bg-[#C9A84C] text-slate-950 text-xs font-bold flex items-center justify-center shadow-xs"
            title={user?.email ?? undefined}
          >
            {initials}
          </div>
        </div>

        {/* Quick Logout */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1 cursor-pointer"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
