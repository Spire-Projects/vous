import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { getOrderStatusClass } from "../utils";
import type { Order } from "../types";

const METRICS = [
  {
    label: "Ventas Totales",
    value: "Bs. 142,850",
    change: "+4.2% vs semana anterior",
    isPositive: true,
    icon: <TrendingUp size={28} strokeWidth={1} />,
  },
  {
    label: "Volumen de Pedidos",
    value: "1,102",
    change: "+12.5% vs semana anterior",
    isPositive: true,
    icon: <ShoppingBag size={28} strokeWidth={1} />,
  },
  {
    label: "Productos Activos",
    value: "1,248",
    change: "12 con stock bajo",
    isPositive: false,
    icon: <Package size={28} strokeWidth={1} />,
  },
  {
    label: "Clientes",
    value: "4,310",
    change: "+87 nuevos este mes",
    isPositive: true,
    icon: <Users size={28} strokeWidth={1} />,
  },
];

const RECENT_ORDERS: Order[] = [
  { id: "#VO-92834", customerName: "Julianna Rossi", customerEmail: "j.rossi@email.com", date: "24 Oct, 2024", total: 1250, status: "ENTREGADO" },
  { id: "#VO-92835", customerName: "Marcello Vargas", customerEmail: "m.vargas@email.com", date: "24 Oct, 2024", total: 890, status: "PENDIENTE" },
  { id: "#VO-92836", customerName: "Sofía Laurent", customerEmail: "s.laurent@email.com", date: "23 Oct, 2024", total: 2450, status: "ENVIADO" },
  { id: "#VO-92837", customerName: "André Dubois", customerEmail: "a.dubois@email.com", date: "23 Oct, 2024", total: 5100, status: "CONFIRMADO" },
];

export function DashboardPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="Analytics Overview"
        subtitle="Resumen del rendimiento VOUS hoy."
        action={
          <button className="px-4 py-2 border border-[#1A1A1A] text-[12px] font-['Montserrat'] uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors">
            Exportar Reporte
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {METRICS.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="xl:col-span-2 bg-white border border-[#E8E5E1] p-6">
          <h2 className="text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-6">
            Crecimiento de Ingresos
          </h2>
          <div className="h-40 flex items-end gap-2">
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((day, i) => {
              const heights = [45, 62, 38, 75, 90, 58, 42];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#C9A84C]/20 relative"
                    style={{ height: `${heights[i]}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-[#C9A84C]"
                      style={{ height: `${60 + i * 5}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-['Montserrat'] text-[#9E9E9E]">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#E8E5E1] p-6">
          <h2 className="text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-4">
            Desglose de Ingresos
          </h2>
          <p className="font-['Bodoni_Moda'] text-3xl text-[#1A1A1A]">Bs. 284,500</p>
          <p className="text-xs text-[#9E9E9E] font-['Montserrat'] mb-4">82% de meta alcanzada</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-['Montserrat'] mb-1">
                <span className="text-[#1A1A1A]">Ventas Directas</span>
                <span className="text-[#9E9E9E]">Bs. 210k</span>
              </div>
              <div className="h-1.5 bg-[#E8E5E1]">
                <div className="h-full bg-[#1A1A1A]" style={{ width: "74%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-['Montserrat'] mb-1">
                <span className="text-[#1A1A1A]">Mayoristas</span>
                <span className="text-[#9E9E9E]">Bs. 74.5k</span>
              </div>
              <div className="h-1.5 bg-[#E8E5E1]">
                <div className="h-full bg-[#C9A84C]" style={{ width: "26%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E1] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E]">
            Pedidos Recientes
          </h2>
          <a href="/pedidos" className="text-[11px] font-['Montserrat'] uppercase tracking-wider text-[#C9A84C] hover:underline">
            Ver todos →
          </a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E5E1]">
              {["Pedido", "Cliente", "Fecha", "Total", "Estado"].map((h) => (
                <th key={h} className="text-left text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#9E9E9E] pb-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((order) => (
              <tr key={order.id} className="border-b border-[#F2F1F0] hover:bg-[#FAFAF9]">
                <td className="py-3 pr-4 font-['Montserrat'] text-[12px] font-semibold text-[#1A1A1A]">{order.id}</td>
                <td className="py-3 pr-4">
                  <p className="text-[13px] font-['Inter'] text-[#1A1A1A]">{order.customerName}</p>
                  <p className="text-[11px] text-[#9E9E9E]">{order.customerEmail}</p>
                </td>
                <td className="py-3 pr-4 text-[12px] font-['Inter'] text-[#9E9E9E]">{order.date}</td>
                <td className="py-3 pr-4 text-[13px] font-['Montserrat'] font-semibold text-[#1A1A1A]">
                  Bs. {order.total.toLocaleString()}
                </td>
                <td className="py-3">
                  <Badge label={order.status} className={getOrderStatusClass(order.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
