import { useState, useMemo } from "react";
import { Search, Check, X, Eye } from "lucide-react";
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
      <div className="grid grid-cols-3 gap-4">
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

      <div className="bg-vous-white border border-vous-border">
        <div className="p-4 border-b border-vous-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
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
                    <p className="text-[13px] font-sans text-vous-black font-medium">
                      {req.contactName}
                    </p>
                    <p className="text-[11px] text-vous-gray font-sans">
                      CI: {req.carnetIdentidad ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {req.phone}
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {req.department}
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {HOW_FOUND_LABELS[req.howFound ?? ""] ?? req.howFound ?? "—"}
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
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
                        className="text-vous-gray hover:text-vous-black transition-colors"
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
                            className="p-1 border border-red-300 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
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
                    className="py-12 text-center text-vous-gray text-sm font-nav"
                  >
                    {search
                      ? "No se encontraron solicitudes con ese filtro."
                      : "No hay solicitudes registradas."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {!loading && !error && (
          <div className="px-4 py-3 border-t border-vous-border">
            <p className="text-[11px] text-vous-gray font-nav">
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
