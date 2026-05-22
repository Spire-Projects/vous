import { useState } from "react";
import { Search, Check, X, Eye, ExternalLink } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { WholesaleRulesPanel } from "@/components/wholesale/WholesaleRulesPanel";
import { useWholesale } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import type { WholesaleRequest, WholesaleRequestStatus } from "@/domain/entities/wholesale.entity";
import type { BadgeProps } from "@/components/ui/badge";

// ── Mapas de estado ────────────────────────────────────────────────────────

const statusVariantMap: Record<WholesaleRequestStatus, BadgeProps["variant"]> = {
  pending: "pending", approved: "gold", rejected: "cancelled",
};
const statusLabelMap: Record<WholesaleRequestStatus, string> = {
  pending: "Pendiente", approved: "Aprobado", rejected: "Rechazado",
};

const howFoundLabelMap: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  tienda_fisica: "Tienda Física Cbba",
  recomendacion: "Me lo recomendaron",
};

function formatDate(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }
  return "—";
}

// ── Tipos de filtro ────────────────────────────────────────────────────────

type FilterTab = "all" | "pending" | "approved" | "rejected";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Aprobados", value: "approved" },
  { label: "Rechazados", value: "rejected" },
];

// ── Componente ─────────────────────────────────────────────────────────────

export function WholesalePage() {
  const { user } = useAuth();
  const { requests, loading, error, review } = useWholesale();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<WholesaleRequest | null>(null);
  const [reviewLoading, setReviewLoading] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "rules">("requests");

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.contactName.toLowerCase().includes(q) ||
      (r.businessName ?? "").toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.department.toLowerCase().includes(q);
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;

  async function handleReview(req: WholesaleRequest, status: "approved" | "rejected") {
    setReviewLoading(req.id);
    try {
      await review({
        requestId: req.id,
        status,
        reviewNote: reviewNote.trim() || undefined,
        reviewedBy: user?.email ?? user?.uid ?? "admin",
      });
      setSelected(null);
      setReviewNote("");
    } finally {
      setReviewLoading(null);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Solicitudes Mayoristas"
        subtitle="Gestión de distribuidores VOUS — formulario oficial de clientes por mayor."
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-vous-border">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2.5 font-nav text-[11px] uppercase tracking-wider transition-colors ${
            activeTab === "requests"
              ? "border-b-2 border-vous-black text-vous-black"
              : "text-vous-gray hover:text-vous-black"
          }`}
        >
          Solicitudes
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-2.5 font-nav text-[11px] uppercase tracking-wider transition-colors ${
            activeTab === "rules"
              ? "border-b-2 border-vous-black text-vous-black"
              : "text-vous-gray hover:text-vous-black"
          }`}
        >
          Reglas Comerciales
        </button>
      </div>

      {activeTab === "rules" ? (
        <div className="bg-vous-white border border-vous-border p-6">
          <WholesaleRulesPanel />
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pendientes" value={loading ? "—" : String(pending)} />
        <StatCard label="Aprobados" value={loading ? "—" : String(approved)} isPositive change={`${approved} socios activos`} />
        <StatCard label="Total Solicitudes" value={loading ? "—" : String(requests.length)} />
      </div>

      {/* Table */}
      <div className="bg-vous-white border border-vous-border">
        {/* Toolbar */}
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
            {TABS.map((tab) => (
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

        {/* Content */}
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
                {["Solicitante", "Teléfono", "Departamento", "¿Cómo nos conoció?", "Fecha", "Estado", "Acciones"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => (
                <TableRow key={req.id}>
                  {/* Solicitante */}
                  <TableCell>
                    <p className="text-[13px] font-sans text-vous-black font-medium">{req.contactName}</p>
                    <p className="text-[11px] text-vous-gray font-sans">CI: {req.carnetIdentidad ?? "—"}</p>
                  </TableCell>

                  {/* Teléfono */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">{req.phone}</TableCell>

                  {/* Departamento */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">{req.department}</TableCell>

                  {/* Cómo nos conoció */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {howFoundLabelMap[req.howFound ?? ""] ?? req.howFound ?? "—"}
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {formatDate(req.createdAt)}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Badge variant={statusVariantMap[req.status]}>
                      {statusLabelMap[req.status]}
                    </Badge>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        title="Ver detalle"
                        onClick={() => { setSelected(req); setReviewNote(""); }}
                        className="text-vous-gray hover:text-vous-black transition-colors"
                      >
                        <Eye size={16} strokeWidth={1.5} />
                      </button>
                      {req.status === "pending" && (
                        <>
                          <button
                            title="Aprobar"
                            disabled={reviewLoading === req.id}
                            onClick={() => void handleReview(req, "approved")}
                            className="p-1 border border-green-300 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                          >
                            <Check size={13} strokeWidth={2} />
                          </button>
                          <button
                            title="Rechazar"
                            disabled={reviewLoading === req.id}
                            onClick={() => void handleReview(req, "rejected")}
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
                  <TableCell colSpan={7} className="py-12 text-center text-vous-gray text-sm font-nav">
                    {search ? "No se encontraron solicitudes con ese filtro." : "No hay solicitudes registradas."}
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

      {/* Detail / Review Dialog */}
      <Dialog open={!!selected} onOpenChange={(open: boolean) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.contactName}</DialogTitle>
            <DialogDescription>CI: {selected?.carnetIdentidad ?? "—"} · {selected?.phone}</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-5 pt-2">
              {/* Data grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Departamento</p>
                  <p className="font-sans text-vous-black">{selected.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">¿Cómo nos conoció?</p>
                  <p className="font-sans text-vous-black">
                    {howFoundLabelMap[selected.howFound ?? ""] ?? selected.howFound ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Estado</p>
                  <Badge variant={statusVariantMap[selected.status]}>{statusLabelMap[selected.status]}</Badge>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Fecha de Solicitud</p>
                  <p className="font-sans text-vous-black">{formatDate(selected.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Dirección de Distribución</p>
                  <p className="font-sans text-vous-black leading-relaxed">
                    {selected.distributionAddress ?? "—"}
                  </p>
                </div>
                {selected.reviewNote && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Nota de Revisión</p>
                    <p className="font-sans text-vous-gray text-sm italic">{selected.reviewNote}</p>
                  </div>
                )}
              </div>

              {/* Capturas de tienda online */}
              {(selected.onlineStoreFiles ?? []).length > 0 && (
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-2">Capturas de Tienda Online</p>
                  <div className="flex flex-wrap gap-2">
                    {(selected.onlineStoreFiles ?? []).map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-nav text-vous-gold border border-vous-gold/40 px-3 py-1.5 hover:bg-vous-gold hover:text-vous-white transition-colors"
                      >
                        <ExternalLink size={11} />
                        Archivo {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Nota de revisión (solo en estado pending) */}
              {selected.status === "pending" && (
                <div className="space-y-1.5 pt-1 border-t border-vous-border">
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray">
                    Nota de revisión (opcional)
                  </p>
                  <textarea
                    rows={2}
                    placeholder="Ej: Aprobado, distribuye en Santa Cruz zona norte…"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="flex w-full border border-vous-border bg-vous-surface px-3 py-2 font-sans text-sm text-vous-black placeholder:text-vous-gray outline-none focus:border-vous-gold transition-colors resize-none"
                  />
                </div>
              )}

              {/* Acciones de revisión */}
              {selected.status === "pending" && (
                <div className="flex gap-2 pt-1 border-t border-vous-border">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                    disabled={reviewLoading === selected.id}
                    onClick={() => void handleReview(selected, "approved")}
                  >
                    {reviewLoading === selected.id ? (
                      <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Check size={13} /> Aprobar</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    disabled={reviewLoading === selected.id}
                    onClick={() => void handleReview(selected, "rejected")}
                  >
                    <X size={13} /> Rechazar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  );
}
