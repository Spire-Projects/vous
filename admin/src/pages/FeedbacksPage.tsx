import { useState } from "react";
import { Search, Pencil, Trash2, CheckCircle, AlertCircle, Clock, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import type { Feedback, FeedbackStatus } from "@/domain/entities/feedback.entity";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisado",
  resolved: "Resuelto",
};

const STATUS_BADGE: Record<FeedbackStatus, "active" | "inactive" | "outline"> = {
  pending: "outline",
  reviewed: "active",
  resolved: "inactive",
};

const TYPE_LABELS: Record<Feedback["type"], string> = {
  queja: "Queja",
  recomendacion: "Recomendación",
};

export function FeedbacksPage() {
  const { items, loading, remove, setStatus } = useFeedbacks();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const filtered = items.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.userName.toLowerCase().includes(q) ||
      f.userEmail.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q)
    );
  });

  const pending = items.filter((f) => f.status === "pending").length;
  const reviewed = items.filter((f) => f.status === "reviewed").length;
  const resolved = items.filter((f) => f.status === "resolved").length;

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  async function handleStatusChange(id: string, status: FeedbackStatus) {
    await setStatus(id, status);
    setEditingStatus(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Quejas o Recomendaciones"
        subtitle="Gestión de feedback de usuarios."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(items.length)} icon={<MessageSquare size={16} />} />
        <StatCard label="Pendientes" value={String(pending)} icon={<Clock size={16} />} />
        <StatCard label="Revisados" value={String(reviewed)} icon={<AlertCircle size={16} />} />
        <StatCard label="Resueltos" value={String(resolved)} icon={<CheckCircle size={16} />} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-4 border-b border-white/40">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-secondary" />
            <Input placeholder="Buscar feedback..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">Cargando feedback...</div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-white/30">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">No hay feedback registrado.</div>
              ) : filtered.map((f) => (
                <div key={f.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Usuario</p>
                      <p className="font-nav text-[13px] font-semibold text-vous-text">{f.userName}</p>
                      <p className="text-[11px] text-vous-text-secondary font-sans">{f.userEmail}</p>
                    </div>
                    <Badge variant={STATUS_BADGE[f.status]} className="font-nav text-[10px] uppercase tracking-wide">
                      {STATUS_LABELS[f.status]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Tipo</p>
                    <p className="text-[12px] font-sans text-vous-text-secondary">{TYPE_LABELS[f.type]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Mensaje</p>
                    <p className="text-[12px] font-sans text-vous-text-secondary line-clamp-3">{f.message}</p>
                  </div>
                  <div className="flex items-center gap-1 pt-1 border-t border-white/30">
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditingStatus(f.id)} title="Cambiar estado">
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(f.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  {editingStatus === f.id && (
                    <div className="flex gap-2 pt-1">
                      {(["pending", "reviewed", "resolved"] as FeedbackStatus[]).map((s) => (
                        <Button key={s} variant="outline" size="sm" onClick={() => handleStatusChange(f.id, s)}>
                          {STATUS_LABELS[s]}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Usuario", "Tipo", "Mensaje", "Estado", "Fecha", ""].map((h) => <TableHead key={h}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-vous-text-secondary py-10">No hay feedback registrado.</TableCell></TableRow>
                  ) : filtered.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <p className="font-nav text-[13px] font-semibold text-vous-text">{f.userName}</p>
                        <p className="text-[11px] text-vous-text-secondary font-sans">{f.userEmail}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-nav text-[10px] uppercase tracking-wide">
                          {TYPE_LABELS[f.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-[12px] font-sans text-vous-text-secondary line-clamp-2">{f.message}</p>
                      </TableCell>
                      <TableCell>
                        {editingStatus === f.id ? (
                          <div className="flex gap-1">
                            {(["pending", "reviewed", "resolved"] as FeedbackStatus[]).map((s) => (
                              <Button key={s} variant="outline" size="sm" onClick={() => handleStatusChange(f.id, s)}>
                                {STATUS_LABELS[s]}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <Badge variant={STATUS_BADGE[f.status]} className="font-nav text-[10px] uppercase tracking-wide">
                            {STATUS_LABELS[f.status]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary whitespace-nowrap">
                        {new Date(f.createdAt).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => setEditingStatus(editingStatus === f.id ? null : f.id)} title="Cambiar estado">
                            <Pencil size={14} />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(f.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar feedback?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}
