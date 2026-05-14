import { useState } from "react";
import { Search, Check, X, FileText } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { getWholesaleStatusClass } from "../utils";
import type { WholesaleRequest } from "../types";

const REQUESTS: WholesaleRequest[] = [
  { id: "WH-9821", businessName: "Atelier Urban Madrid", contactName: "Javier Morente", email: "javier@atelierurban.es", location: "Madrid, ES", date: "24 Oct, 2024", status: "PENDIENTE" },
  { id: "WH-7732", businessName: "Luxe Boutique BCN", contactName: "Elena Garcés", email: "info@luxebcn.com", location: "Barcelona, ES", date: "20 Oct, 2024", status: "APROBADO" },
  { id: "WH-1109", businessName: "Sartoria Moderna", contactName: "Pietro Rossi", email: "p.rossi@sartoria.it", location: "Milán, IT", date: "18 Oct, 2024", status: "PENDIENTE" },
  { id: "WH-4450", businessName: "Mode Paris Est.", contactName: "Claire Dupont", email: "c.dupont@mode.fr", location: "París, FR", date: "15 Oct, 2024", status: "RECHAZADO" },
];

export function WholesalePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"TODOS" | "PENDIENTE">("TODOS");

  const filtered = REQUESTS.filter((r) => {
    const matchSearch = !search || r.businessName.toLowerCase().includes(search.toLowerCase()) || r.contactName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "TODOS" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = REQUESTS.filter((r) => r.status === "PENDIENTE").length;
  const approved = REQUESTS.filter((r) => r.status === "APROBADO").length;

  return (
    <div className="p-8">
      <PageHeader
        title="Solicitudes Mayoristas"
        subtitle="Red exclusiva de distribuidores VOUS Urban Luxury."
        action={
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A] text-[12px] font-['Montserrat'] uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors">
            <FileText size={14} strokeWidth={1.5} />
            Guía de Aprobación
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Pendientes este mes" value={String(pending)} />
        <StatCard label="Aprobados totales" value={String(approved)} isPositive change={`${approved} socios activos`} />
        <StatCard label="Total solicitudes" value={String(REQUESTS.length)} />
      </div>

      <div className="bg-white border border-[#E8E5E1]">
        <div className="p-4 border-b border-[#E8E5E1] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="text"
              placeholder="Buscar negocio o contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#E8E5E1] text-sm font-['Inter'] bg-[#FAFAF9] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          {(["TODOS", "PENDIENTE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-['Montserrat'] uppercase tracking-wider border transition-colors ${
                filter === f ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-[#E8E5E1] text-[#9E9E9E] hover:border-[#1A1A1A]"
              }`}
            >
              {f === "TODOS" ? "Todos" : "Pendientes"}
            </button>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E5E1]">
              {["Negocio", "Contacto", "Ubicación", "Fecha", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#9E9E9E] px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr key={req.id} className="border-b border-[#F2F1F0] hover:bg-[#FAFAF9] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-['Montserrat'] text-[13px] font-semibold text-[#1A1A1A]">{req.businessName}</p>
                  <p className="text-[11px] text-[#9E9E9E] font-['Inter']">ID: {req.id}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-['Inter'] text-[#1A1A1A]">{req.contactName}</p>
                  <p className="text-[11px] text-[#9E9E9E]">{req.email}</p>
                </td>
                <td className="px-4 py-3 text-[12px] font-['Inter'] text-[#9E9E9E]">{req.location}</td>
                <td className="px-4 py-3 text-[12px] font-['Inter'] text-[#9E9E9E]">{req.date}</td>
                <td className="px-4 py-3">
                  <Badge label={req.status} className={getWholesaleStatusClass(req.status)} />
                </td>
                <td className="px-4 py-3">
                  {req.status === "PENDIENTE" ? (
                    <div className="flex gap-2">
                      <button className="p-1.5 border border-green-300 text-green-600 hover:bg-green-50 transition-colors" title="Aprobar">
                        <Check size={14} strokeWidth={2} />
                      </button>
                      <button className="p-1.5 border border-red-300 text-red-500 hover:bg-red-50 transition-colors" title="Rechazar">
                        <X size={14} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button className="text-[11px] font-['Montserrat'] uppercase tracking-wider text-[#C9A84C] hover:underline">
                      Ver Detalles
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-[#E8E5E1]">
          <p className="text-[11px] text-[#9E9E9E] font-['Montserrat']">
            Mostrando {filtered.length} de {REQUESTS.length} solicitudes
          </p>
        </div>
      </div>

      <div className="mt-6 p-5 border border-[#E8E5E1] bg-[#FAFAF9]">
        <p className="text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#C9A84C] mb-2">
          Política de Distribución
        </p>
        <p className="text-sm font-['Inter'] text-[#9E9E9E] leading-relaxed">
          Solo aceptamos partners que compartan nuestra visión de exclusividad y sostenibilidad urbana.
          Revise los criterios de selección antes de aprobar nuevas cuentas mayoristas.
        </p>
      </div>
    </div>
  );
}
