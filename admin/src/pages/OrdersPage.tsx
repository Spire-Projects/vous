import { useState } from "react";
import { Search, Receipt, Eye, TrendingUp } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { getOrderStatusClass } from "../utils";
import type { Order, OrderStatus } from "../types";

const ALL_ORDERS: Order[] = [
  { id: "#VO-8829", customerName: "Adrián Martínez", customerEmail: "adrian.m@email.com", date: "24 Oct, 2024", total: 1240, status: "ENVIADO" },
  { id: "#VO-8830", customerName: "Elena Llopis", customerEmail: "elena.l@email.com", date: "24 Oct, 2024", total: 890, status: "PENDIENTE" },
  { id: "#VO-8831", customerName: "Ricardo Costa", customerEmail: "r.costa@email.com", date: "23 Oct, 2024", total: 3150, status: "ENVIADO" },
  { id: "#VO-8832", customerName: "Sofía Beltrán", customerEmail: "sofia.b@email.com", date: "23 Oct, 2024", total: 450, status: "CONFIRMADO" },
  { id: "#VO-8833", customerName: "Carlos Mendez", customerEmail: "c.mendez@email.com", date: "22 Oct, 2024", total: 1800, status: "ENTREGADO" },
  { id: "#VO-8834", customerName: "Valentina Cruz", customerEmail: "v.cruz@email.com", date: "22 Oct, 2024", total: 620, status: "CANCELADO" },
];

const TABS: { label: string; value: OrderStatus | "TODOS" }[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Pendiente Pago", value: "PENDIENTE" },
  { label: "Enviado", value: "ENVIADO" },
  { label: "Confirmado", value: "CONFIRMADO" },
  { label: "Preparando", value: "PREPARANDO" },
  { label: "Entregado", value: "ENTREGADO" },
];

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus | "TODOS">("TODOS");

  const filtered = ALL_ORDERS.filter((o) => {
    const matchTab = activeTab === "TODOS" || o.status === activeTab;
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-8">
      <PageHeader
        title="Listado de Pedidos"
        subtitle="Gestión de ventas y flujo de estados en tiempo real."
        action={
          <button className="px-4 py-2 border border-[#1A1A1A] text-[12px] font-['Montserrat'] uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors">
            Exportar CSV
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Nuevos Hoy" value="24" icon={<TrendingUp size={24} strokeWidth={1} />} />
        <StatCard label="En Camino" value="12" icon={<Receipt size={24} strokeWidth={1} />} />
        <StatCard label="Eficiencia" value="98%" isPositive change="+2% vs mes anterior" />
      </div>

      <div className="bg-white border border-[#E8E5E1]">
        <div className="p-4 border-b border-[#E8E5E1] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="text"
              placeholder="Buscar pedido o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#E8E5E1] text-sm font-['Inter'] bg-[#FAFAF9] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 text-[11px] font-['Montserrat'] uppercase tracking-wider transition-colors ${
                  activeTab === tab.value
                    ? "bg-[#1A1A1A] text-white"
                    : "border border-[#E8E5E1] text-[#9E9E9E] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E5E1]">
              {["Pedido", "Cliente", "Fecha", "Total", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#9E9E9E] px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-[#F2F1F0] hover:bg-[#FAFAF9] transition-colors">
                <td className="px-4 py-3 font-['Montserrat'] text-[12px] font-semibold">{order.id}</td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-['Inter']">{order.customerName}</p>
                  <p className="text-[11px] text-[#9E9E9E]">{order.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#9E9E9E] font-['Inter']">{order.date}</td>
                <td className="px-4 py-3 font-['Montserrat'] text-[13px] font-semibold">
                  Bs. {order.total.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Badge label={order.status} className={getOrderStatusClass(order.status)} />
                </td>
                <td className="px-4 py-3">
                  <button className="text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors" title="Ver detalle">
                    <Eye size={16} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#9E9E9E] text-sm font-['Inter']">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-[#E8E5E1] flex items-center justify-between">
          <p className="text-[11px] text-[#9E9E9E] font-['Montserrat']">
            Mostrando {filtered.length} de {ALL_ORDERS.length} pedidos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 text-[12px] font-['Montserrat'] border ${p === 1 ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-[#E8E5E1] text-[#9E9E9E] hover:border-[#1A1A1A]"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
