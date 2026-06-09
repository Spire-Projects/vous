import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Settings, Tag,
  FileText, BarChart2, UserCog, Layers, LogOut, Image, LayoutGrid, X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSiteConfig } from "../../hooks/useSiteConfig";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Pedidos", path: "/pedidos", icon: ShoppingCart },
  { label: "Inventario", path: "/inventario", icon: Package },
  { label: "Categorías", path: "/categorias", icon: Layers },
  { label: "Clientes", path: "/clientes", icon: Users },
  { label: "Mayoristas", path: "/mayoristas", icon: UserCog },
  { label: "Blog / Revista", path: "/blog", icon: FileText },
  { label: "FAQ", path: "/faq", icon: FileText },
  { label: "Banners", path: "/banners", icon: Image },
  { label: "Secciones Landing", path: "/landing-secciones", icon: LayoutGrid },
  { label: "Descuentos", path: "/descuentos", icon: Tag },
  { label: "Reportes", path: "/reportes", icon: BarChart2 },
  { label: "Configuración", path: "/configuracion", icon: Settings },
];

const NAV_BASE =
  "flex items-center gap-3 px-4 py-2.5 mx-3 text-[12px] font-nav tracking-wide rounded-xl transition-all duration-200";
const NAV_ACTIVE = `${NAV_BASE} bg-vous-gold/20 text-vous-gold shadow-lg shadow-amber-500/10`;
const NAV_INACTIVE = `${NAV_BASE} text-white/50 hover:text-white hover:bg-white/5`;

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-[#0D0D0C]/95 backdrop-blur-xl flex flex-col z-40 transition-transform duration-400 ease-out lg:translate-x-0 border-r border-white/5 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-vous-gold" />

      <button
        className="absolute top-4 right-4 lg:hidden text-white/50 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Cerrar menú"
      >
        <X size={18} />
      </button>

      <div className="px-6 py-7 border-b border-white/5">
        <div className="flex flex-col items-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <p className="font-serif text-xl tracking-[0.15em] text-white">{storeName}</p>
          )}
          <p className="text-[10px] font-nav tracking-[0.25em] uppercase text-vous-gold mt-2">
            Admin Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === "/"}
                onClick={handleNavClick}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive ? NAV_ACTIVE : NAV_INACTIVE
                }
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </NavLink>
            </li>
          ))}

          {user?.role === "superadmin" && (
            <li>
              <NavLink
                to="/usuarios"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive ? NAV_ACTIVE : NAV_INACTIVE
                }
              >
                <UserCog size={15} strokeWidth={1.5} />
                Usuarios Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-vous-gold text-[#0D0D0C] text-xs font-bold font-nav rounded-xl">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-nav text-white tracking-wide truncate">{user?.email}</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-vous-gold/80">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/30 hover:text-vous-gold text-[11px] font-nav tracking-wide transition-colors"
        >
          <LogOut size={13} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
