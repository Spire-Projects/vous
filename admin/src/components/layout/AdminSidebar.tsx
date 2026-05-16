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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Pedidos", path: "/pedidos", icon: ShoppingCart },
  { label: "Inventario", path: "/inventario", icon: Package },
  { label: "Categorías", path: "/categorias", icon: Layers },
  { label: "Clientes", path: "/clientes", icon: Users },
  { label: "Mayoristas", path: "/mayoristas", icon: UserCog },
  { label: "Blog / Revista", path: "/blog", icon: FileText },
  { label: "FAQ", path: "/faq", icon: FileText },
  { label: "Descuentos", path: "/descuentos", icon: Tag },
  { label: "Reportes", path: "/reportes", icon: BarChart2 },
  { label: "Configuración", path: "/configuracion", icon: Settings },
];

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] text-white flex flex-col z-40">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-['Bodoni_Moda'] text-xl tracking-widest text-white">VOUS</p>
        <p className="text-[11px] font-['Montserrat'] tracking-[0.2em] uppercase text-[#C9A84C] mt-1">
          Admin Portal
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === "/"}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded text-[13px] font-['Montserrat'] tracking-wide transition-colors ${
                    isActive
                      ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </NavLink>
            </li>
          ))}

          {user?.role === "superadmin" && (
            <li>
              <NavLink
                to="/usuarios"
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded text-[13px] font-['Montserrat'] tracking-wide transition-colors ${
                    isActive
                      ? "bg-[#C9A84C] text-[#1A1A1A] font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`
                }
              >
                <UserCog size={16} strokeWidth={1.5} />
                Usuarios Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] text-xs font-bold font-['Montserrat']">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-['Montserrat'] text-white truncate">{user?.email}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#C9A84C]">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/50 hover:text-white text-[12px] font-['Montserrat'] transition-colors"
        >
          <LogOut size={14} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
