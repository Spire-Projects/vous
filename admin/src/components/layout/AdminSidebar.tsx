import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Tag,
  FileText,
  BarChart2,
  UserCog,
  Layers,
  LogOut,
  Image,
  X,
  Map,
  Lightbulb,
  HelpCircle,
  Shirt,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSiteConfig } from "../../hooks/useSiteConfig";

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: typeof LayoutDashboard;
    badgePills?: { label: string; bg: string; text: string }[];
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "PRINCIPAL",
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    title: "GESTIÓN",
    items: [
      {
        label: "Pedidos",
        path: "/pedidos",
        icon: ShoppingCart,
        badgePills: [
          { label: "2", bg: "bg-[#C9A84C]/25", text: "text-[#E6C66E]" },
          { label: "2", bg: "bg-slate-800", text: "text-slate-300" },
        ],
      },
      { label: "Inventario", path: "/inventario", icon: Package },
      { label: "Categorías", path: "/categorias", icon: Layers },
      { label: "Ropa", path: "/ropa", icon: Shirt },
      { label: "Descuentos", path: "/descuentos", icon: Tag },
    ],
  },
  {
    title: "PERSONAS",
    items: [
      { label: "Usuarios", path: "/usuarios", icon: Users },
      { label: "Mayoristas", path: "/mayoristas", icon: UserCog },
      { label: "Soporte", path: "/soporte", icon: HelpCircle },
      { label: "Asesoría", path: "/asesoria", icon: Lightbulb },
    ],
  },
  {
    title: "CONFIGURACIÓN & MÁS",
    items: [
      { label: "Contenido", path: "/contenido", icon: FileText },
      { label: "Landing", path: "/landing", icon: Image },
      { label: "Reportes", path: "/reportes", icon: BarChart2 },
      { label: "Mapa", path: "/mapa", icon: Map },
      { label: "Configuración", path: "/configuracion", icon: Settings },
    ],
  },
];

const NAV_BASE =
  "flex items-center gap-3 px-3.5 py-2.5 mx-3 text-xs tracking-wide rounded-xl transition-all duration-150 font-medium select-none";
const NAV_ACTIVE = `${NAV_BASE} bg-[#C9A84C] text-slate-950 font-semibold shadow-xs`;
const NAV_INACTIVE = `${NAV_BASE} text-slate-400 hover:text-white hover:bg-white/5`;

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const { config } = useSiteConfig();
  const navigate = useNavigate();

  const storeName = config?.storeName ?? "VOUS";
  const logoUrl = config?.logoUrl;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function handleNavClick() {
    onClose();
  }

  const userInitial =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "A";

  const userName = user?.name || user?.email || "Administrador";
  const userRole =
    user?.role === "admin"
      ? "Administrador General"
      : user?.role || "Administrador";

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-[#0B0F19] text-white flex flex-col z-40 transition-transform duration-300 ease-out lg:translate-x-0 border-r border-slate-800/60 select-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Mobile close button */}
      <button
        className="absolute top-4 right-4 lg:hidden text-slate-400 hover:text-white transition-colors p-1"
        onClick={onClose}
        aria-label="Cerrar menú"
      >
        <X size={18} />
      </button>

      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C9A84C] flex items-center justify-center text-slate-950 shrink-0 shadow-xs font-bold">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="h-5 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <BookOpen size={18} strokeWidth={2} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight truncate">
                {storeName}
              </span>
              <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                v1.0.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">
              Sistema de gestión
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-6 mb-1.5">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ label, path, icon: Icon, badgePills }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === "/"}
                    onClick={handleNavClick}
                    className={({ isActive }: { isActive: boolean }) =>
                      isActive ? NAV_ACTIVE : NAV_INACTIVE
                    }
                  >
                    <Icon size={16} strokeWidth={1.8} className="shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {badgePills && (
                      <div className="flex items-center gap-1 ml-auto shrink-0">
                        {badgePills.map((bp, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${bp.bg} ${bp.text}`}
                          >
                            {bp.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Card at bottom */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080C14]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C] text-slate-950 text-xs font-bold flex items-center justify-center shrink-0">
            {userInitial}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-semibold text-white tracking-tight truncate">
              {userName}
            </p>
            <p className="text-[10px] text-slate-400 capitalize truncate">
              {userRole}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs tracking-wide transition-colors mt-3 w-full pt-2 border-t border-slate-800/50 cursor-pointer"
        >
          <LogOut size={13} strokeWidth={1.8} />
          <span>Cerrar sesión</span>
        </button>

        <p className="text-[10px] text-slate-600 mt-2 font-mono">
          v1.0.2 - Vous Admin
        </p>
      </div>
    </aside>
  );
}
