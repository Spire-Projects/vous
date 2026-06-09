import { useState, useMemo } from "react";
import { Search, Check, X, Eye, Filter } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { WholesaleDetailDialog } from "./WholesaleDetailDialog";
import type { WholesaleRequest } from "@/domain/entities/wholesale.entity";
import { STATUS_VARIANT, STATUS_LABEL, HOW_FOUND_LABELS, formatDate } from "./types";
import type { FilterTab } from "./types";
import { FILTER_TABS } from "./types";

interface WholesaleRequestsTabProps {
  requests: WholesaleRequest[];
  loading: boolean;
  error: string | null;
  reviewLoading: string | null;
  reviewNote: string;
  onReviewNoteChange: (v: string) => void;
  onReview: (req: WholesaleRequest, status: "approved" | "rejected") => void;
}

export function WholesaleRequestsTab({
  requests,
  loading,
  error,
  reviewLoading,
  reviewNote,
  onReviewNoteChange,
  onReview,
}: WholesaleRequestsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<WholesaleRequest | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchSearch =
        !search ||
        r.contactName.toLowerCase().includes(q) ||
        (r.businessName ?? "").toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.department.toLowerCase().includes(q);
      return matchSearch && (filter === "all" || r.status === filter);
    });
  }, [requests, search, filter]);

  const pending = useMemo(
    () => requests.filter((r) => r.status === "pending").length,
    [requests]
  );
  const approved = useMemo(
    () => requests.filter((r) => r.status === "approved").length,
    [requests]
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pendientes" value={loading ? "—" : String(pending)} />
        <StatCard
          label="Aprobados"
          value={loading ? "—" : String(approved)}
          isPositive
          change={`${approved} socios activos`}
        />
        <StatCard
          label="Total Solicitudes"
          value={loading ? "—" : String(requests.length)}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-4 border-b border-white/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-secondary" />
            <Input
              placeholder="Buscar nombre, depto, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {FILTER_TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={filter === tab.value ? "default" : "outline"}
                onClick={() => setFilter(tab.value)}
              >
                <Filter size={12} />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm text-red-600 font-nav">{error}</p>
          </div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-white/30">
              {filtered.map((req) => (
                <div key={req.id} className="p-4 hover:bg-amber-50/30 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Negocio</p>
                      <p className="font-nav text-[13px] font-semibold text-vous-text">
                        {req.businessName || req.contactName}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[req.status]}>
                      {STATUS_LABEL[req.status]}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Solicitante</p>
                      <p className="text-[13px] font-sans text-vous-text font-medium">{req.contactName}</p>
                      <p className="text-[11px] text-vous-text-secondary font-sans">CI: {req.carnetIdentidad ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Teléfono</p>
                      <p className="text-[12px] font-sans text-vous-text-secondary">{req.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Fecha</p>
                      <p className="text-[12px] font-sans text-vous-text-secondary">{formatDate(req.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Departamento</p>
                      <p className="text-[12px] font-sans text-vous-text-secondary">{req.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-white/30">
                    <button
                      title="Ver detalle"
                      onClick={() => {
                        setSelected(req);
                        onReviewNoteChange("");
                      }}
                      className="text-vous-text-secondary hover:text-vous-text transition-colors"
                    >
                      <Eye size={16} strokeWidth={1.5} />
                    </button>
                    {req.status === "pending" && (
                      <>
                        <button
                          title="Aprobar"
                          disabled={reviewLoading === req.id}
                          onClick={() => onReview(req, "approved")}
                          className="p-1 border border-green-300 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                        >
                          <Check size={13} strokeWidth={2} />
                        </button>
                        <button
                          title="Rechazar"
                          disabled={reviewLoading === req.id}
                          onClick={() => onReview(req, "rejected")}
                          className="p-1 border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <X size={13} strokeWidth={2} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="p-6 text-center text-vous-text-secondary text-sm font-nav">
                  {search
                    ? "No se encontraron solicitudes con ese filtro."
                    : "No hay solicitudes registradas."}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Solicitante", "Teléfono", "Departamento", "Cómo nos conoció", "Fecha", "Estado", "Acciones"].map(
                      (h) => (
                        <TableHead key={h}>{h}</TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <p className="text-[13px] font-sans text-vous-text font-medium">
                          {req.contactName}
                        </p>
                        <p className="text-[11px] text-vous-text-secondary font-sans">
                          CI: {req.carnetIdentidad ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {req.phone}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {req.department}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {HOW_FOUND_LABELS[req.howFound ?? ""] ?? req.howFound ?? "—"}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {formatDate(req.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[req.status]}>
                          {STATUS_LABEL[req.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            title="Ver detalle"
                            onClick={() => {
                              setSelected(req);
                              onReviewNoteChange("");
                            }}
                            className="text-vous-text-secondary hover:text-vous-text transition-colors"
                          >
                            <Eye size={16} strokeWidth={1.5} />
                          </button>
                          {req.status === "pending" && (
                            <>
                              <button
                                title="Aprobar"
                                disabled={reviewLoading === req.id}
                                onClick={() => onReview(req, "approved")}
                                className="p-1 border border-green-300 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                              >
                                <Check size={13} strokeWidth={2} />
                              </button>
                              <button
                                title="Rechazar"
                                disabled={reviewLoading === req.id}
                                onClick={() => onReview(req, "rejected")}
                                className="p-1 border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                              >
                                <X size={13} strokeWidth={2} />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-vous-text-secondary text-sm font-nav"
                      >
                        {search
                          ? "No se encontraron solicitudes con ese filtro."
                          : "No hay solicitudes registradas."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && !error && (
          <div className="px-4 py-3 border-t border-white/40">
            <p className="text-[11px] text-vous-text-secondary font-nav">
              Mostrando {filtered.length} de {requests.length} solicitudes
            </p>
          </div>
        )}
      </div>

      <WholesaleDetailDialog
        selected={selected}
        onClose={() => setSelected(null)}
        reviewLoading={reviewLoading}
        reviewNote={reviewNote}
        onReviewNoteChange={onReviewNoteChange}
        onApprove={(req) => onReview(req, "approved")}
        onReject={(req) => onReview(req, "rejected")}
      />
    </>
  );
}
