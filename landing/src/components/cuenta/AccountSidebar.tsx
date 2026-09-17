"use client";

interface Tab {
  id: string;
  label: string;
}
const TABS: Tab[] = [
  { id: "perfil", label: "Datos Personales" },
  { id: "pedidos", label: "Mis Pedidos" },
  { id: "mayorista", label: "Solicitud Mayorista" },
  { id: "direcciones", label: "Direcciones" },
];

interface AccountSidebarProps {
  active: string;
  onTab: (id: string) => void;
  onLogout: () => void;
}

export function AccountSidebar({ active, onTab, onLogout }: AccountSidebarProps) {
  return (
    <aside className="lg:w-56 shrink-0">
      <div className="bg-white p-6 lg:sticky lg:top-24">
        <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-5">
          Mi Cuenta
        </p>
        <nav className="space-y-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onTab(id)}
              className={`block w-full text-left font-sans text-sm py-2.5 px-3 transition-colors ${
                active === id
                  ? "bg-black text-white"
                  : "text-black/50 hover:text-black hover:bg-black/5"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="block w-full text-left font-sans text-sm py-2.5 px-3 text-black/50 hover:text-red-500 transition-colors mt-2"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </aside>
  );
}
