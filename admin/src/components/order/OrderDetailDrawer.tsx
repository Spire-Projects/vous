import { useState, useEffect, useRef } from "react";
import {
  X, User, MapPin, Package, FileText, Download, ExternalLink,
  Save, AlertTriangle, Truck, Clock,
} from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getOrderStatusLabel } from "@/utils";
import type { Order, OrderStatus, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

const ALL_STATUSES: OrderStatus[] = [
  "pending", "payment_sent", "verifying_payment", "confirmed",
  "preparing", "shipped", "delivered",
];

const STATUS_BADGE: Record<OrderStatus, BadgeProps["variant"]> = {
  pending: "pending", payment_sent: "payment", verifying_payment: "verifying",
  confirmed: "confirmed", preparing: "preparing", shipped: "shipped",
  delivered: "delivered", cancelled: "cancelled",
};

const CANCELABLE: OrderStatus[] = [
  "pending", "payment_sent", "verifying_payment", "confirmed", "preparing", "shipped",
];

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border border-vous-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-vous-text-secondary">{icon}</span>
        <h3 className="font-nav text-[11px] uppercase tracking-[0.15em] text-vous-text">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatusStepper({ status }: { status: OrderStatus }) {
  const currentIdx = ALL_STATUSES.indexOf(status);
  const isCancelled = status === "cancelled";
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {ALL_STATUSES.map((s, i) => {
        const done = !isCancelled && i <= currentIdx;
        const active = !isCancelled && i === currentIdx;
        return (
          <div key={s} className="flex items-center shrink-0">
            <div className={`flex flex-col items-center gap-1 ${active ? "opacity-100" : done ? "opacity-70" : "opacity-30"}`}>
              <div className={`w-2 h-2 rounded-full ${active ? "bg-vous-black scale-125" : done ? "bg-vous-black" : "bg-vous-border"}`} />
              <span className="font-nav text-[8px] tracking-wide uppercase whitespace-nowrap text-vous-text-secondary">
                {getOrderStatusLabel(s)}
              </span>
            </div>
            {i < ALL_STATUSES.length - 1 && (
              <div className={`h-px w-4 mx-1 mb-4 ${!isCancelled && i < currentIdx ? "bg-vous-black" : "bg-vous-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (input: UpdateOrderStatusInput) => Promise<void>;
  onCancelWithRestore: (orderId: string, note: string) => Promise<void>;
  onNotesUpdate: (orderId: string, notes: string) => Promise<void>;
}

export function OrderDetailDrawer({
  order, onClose, onStatusChange, onCancelWithRestore, onNotesUpdate,
}: OrderDetailDrawerProps) {
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const notesSavedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orderId = order?.id;
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (order) {
      setNotes(order.adminNotes ?? "");
      setTargetStatus(null);
      setStatusNote("");
      setSaving(false);
      setCancelNote("");
      setShowCancelConfirm(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => { if (notesSavedTimer.current) clearTimeout(notesSavedTimer.current); };
  }, []);

  if (!order) return null;

  const canCancel = CANCELABLE.includes(order.status);

  async function handleStatusChange(status: OrderStatus) {
    setTargetStatus(status);
    setStatusNote("");
  }

  async function handleStatusSave() {
    if (!targetStatus) return;
    setSaving(true);
    try {
      await onStatusChange({
        orderId: order!.id,
        status: targetStatus,
        note: statusNote.trim() || undefined,
      });
      setTargetStatus(null);
      setStatusNote("");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelConfirm() {
    if (!cancelNote.trim()) return;
    setSaving(true);
    try {
      await onCancelWithRestore(order!.id, cancelNote.trim());
      setShowCancelConfirm(false);
      setCancelNote("");
    } finally {
      setSaving(false);
    }
  }

  async function handleNotesSave() {
    setSavingNotes(true);
    try {
      await onNotesUpdate(order!.id, notes);
      setNotesSaved(true);
      if (notesSavedTimer.current) clearTimeout(notesSavedTimer.current);
      notesSavedTimer.current = setTimeout(() => setNotesSaved(false), 2000);
    } finally {
      setSavingNotes(false);
    }
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("es-BO", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-vous-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full md:max-w-[680px] bg-vous-surface flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-white/40 shrink-0">
          <div>
            <p className="font-nav text-[11px] uppercase tracking-[0.15em] text-vous-text-secondary">Pedido</p>
            <h2 className="font-serif text-xl font-medium text-vous-text mt-0.5">{order.orderNumber}</h2>
            <p className="font-sans text-xs text-vous-text-secondary mt-1">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={STATUS_BADGE[order.status]}>{getOrderStatusLabel(order.status)}</Badge>
            <button onClick={onClose} className="text-vous-text-secondary hover:text-vous-text transition-colors" aria-label="Cerrar panel">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-white/40 shrink-0 overflow-x-auto">
          <StatusStepper status={order.status} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-5">
            {/* ── Gestión de estado — ALL statuses ────────────────────── */}
            <Section title="Cambiar estado" icon={<Package size={14} />}>
              {order.status === "delivered" || order.status === "cancelled" ? (
                <p className="font-sans text-xs text-vous-text-secondary">
                  {order.status === "delivered" ? "Pedido entregado." : "Pedido cancelado."} Estado final.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={saving}
                        className={`px-3 py-1.5 font-nav text-[10px] uppercase tracking-wider border transition-colors ${
                          targetStatus === s
                            ? "bg-vous-black text-white border-vous-black"
                            : "border-vous-border text-vous-text-secondary hover:border-vous-black hover:text-vous-text"
                        }`}
                      >
                        {getOrderStatusLabel(s)}
                      </button>
                    ))}
                  </div>

                  {targetStatus && (
                    <div className="space-y-3 pt-3 border-t border-white/40">
                      <div className="space-y-1">
                        <Label className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
                          Nota para el cambio a &quot;{getOrderStatusLabel(targetStatus)}&quot;
                        </Label>
                        <Textarea
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          placeholder="Ej: Pago verificado, stock confirmado…"
                          rows={2}
                          className="text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleStatusSave} disabled={saving} className="gap-1.5">
                          <Save size={13} /> {saving ? "Guardando…" : "Confirmar cambio"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setTargetStatus(null)} disabled={saving}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {canCancel && (
                <div className="mt-4 pt-4 border-t border-white/40">
                  <Button variant="danger" size="sm" onClick={() => setShowCancelConfirm(true)} disabled={saving} className="gap-1.5">
                    <AlertTriangle size={13} /> Cancelar pedido
                  </Button>
                </div>
              )}
            </Section>

            {/* ── Historial de estados ───────────────────────────────────── */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Section title="Historial de cambios" icon={<Clock size={14} />}>
                <div className="space-y-3">
                  {[...order.statusHistory].reverse().map((entry, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/40 last:border-0 last:pb-0">
                      <Badge variant={STATUS_BADGE[entry.status]}>{getOrderStatusLabel(entry.status)}</Badge>
                      <div className="flex-1 min-w-0">
                        {entry.notes && (
                          <p className="font-sans text-xs text-vous-text-secondary leading-relaxed">{entry.notes}</p>
                        )}
                        <p className="font-sans text-[10px] text-vous-text-muted mt-0.5">
                          {new Date(entry.timestamp).toLocaleDateString("es-BO", {
                            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Cliente ──────────────────────────────────────────────── */}
            <Section title="Cliente" icon={<User size={14} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-[13px]">
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Nombre</p>
                  <p className="text-vous-text truncate">{order.customer.name || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Email</p>
                  <p className="text-vous-text break-all">{order.customer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Celular</p>
                  <p className="text-vous-text truncate">{order.customer.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Departamento</p>
                  <p className="text-vous-text truncate">{order.customer.department || "—"}</p>
                </div>
              </div>
            </Section>

            {/* ── Envío ────────────────────────────────────────────────── */}
            {order.shippingInfo && (
              <Section title="Información de envío" icon={<MapPin size={14} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-[13px]">
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Tipo</p>
                    <p className="text-vous-text capitalize">{order.shippingInfo.shippingType === "local" ? "Dentro del departamento" : "Fuera del departamento"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Destinatario</p>
                    <p className="text-vous-text truncate">{order.shippingInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Ciudad / Depto.</p>
                    <p className="text-vous-text truncate">{order.shippingInfo.city}, {order.shippingInfo.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Celular</p>
                    <p className="text-vous-text truncate">{order.shippingInfo.phone || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Dirección</p>
                    <p className="text-vous-text truncate">{order.shippingInfo.address || "—"}</p>
                  </div>
                  {order.shippingInfo.carrier && (
                    <div>
                      <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Transportista</p>
                      <p className="text-vous-text truncate">{order.shippingInfo.carrier}</p>
                    </div>
                  )}
                  {order.shippingInfo.trackingInfo && (
                    <div>
                      <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Tracking</p>
                      <p className="text-vous-text truncate">{order.shippingInfo.trackingInfo}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            <Section title="Transportista externo" icon={<Truck size={14} />}>
              <p className="font-sans text-[11px] text-vous-text-secondary mb-2">Referencia Yango u otro (opcional).</p>
              <p className="font-sans text-sm text-vous-text">{order.carrierRef || <span className="text-vous-text-secondary italic">Sin referencia registrada.</span>}</p>
            </Section>

            {/* ── Ítems ─────────────────────────────────────────────────── */}
            <Section title="Ítems del pedido" icon={<Package size={14} />}>
              <div className="flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-12 h-14 object-cover border border-vous-border shrink-0" />
                    ) : (
                      <div className="w-12 h-14 bg-white/90 border border-vous-border shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[13px] font-medium text-vous-text truncate">{item.productName}</p>
                      {item.variantDescription && <p className="font-sans text-[11px] text-vous-text-secondary">{item.variantDescription}</p>}
                      <p className="font-sans text-[11px] text-vous-text-secondary mt-0.5">{item.quantity} × Bs. {item.unitPrice.toLocaleString("es-BO")}</p>
                    </div>
                    <p className="font-nav text-[13px] font-semibold text-vous-text shrink-0">Bs. {item.subtotal.toLocaleString("es-BO")}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/40 font-sans text-[13px] flex flex-col gap-1.5">
                <div className="flex justify-between text-vous-text-secondary">
                  <span>Subtotal</span>
                  <span>Bs. {order.subtotal.toLocaleString("es-BO")}</span>
                </div>
                {!!order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento{order.discountCode ? ` (${order.discountCode})` : ""}</span>
                    <span>-Bs. {order.discountAmount.toLocaleString("es-BO")}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-vous-text text-sm pt-1 border-t border-white/40">
                  <span>Total</span>
                  <span>Bs. {order.total.toLocaleString("es-BO")}</span>
                </div>
                {order.isWholesale && <p className="font-nav text-[9px] uppercase tracking-wider text-vous-gold">Precio mayorista</p>}
              </div>
            </Section>

            {/* ── Comprobante ────────────────────────────────────────────── */}
            <Section title="Comprobante de pago" icon={<FileText size={14} />}>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={order.paymentMethod === "qr" ? "gold" : "outline"}>
                  {order.paymentMethod === "qr" ? "QR / Transferencia" : "Libélula"}
                </Badge>
              </div>
              {order.paymentProof ? (
                <div className="flex flex-col gap-3">
                  <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={order.paymentProof} alt="Comprobante" className="max-h-48 w-auto max-w-full border border-vous-border object-contain" />
                  </a>
                  <div className="flex gap-2">
                    <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary hover:text-vous-text transition-colors">
                      <ExternalLink size={12} /> Ver en nueva pestaña
                    </a>
                    <a href={order.paymentProof} download className="inline-flex items-center gap-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary hover:text-vous-text transition-colors">
                      <Download size={12} /> Descargar
                    </a>
                  </div>
                </div>
              ) : (
                <p className="font-sans text-[13px] text-vous-text-secondary italic">El cliente aún no ha subido un comprobante.</p>
              )}
            </Section>

            {/* ── Notas internas ─────────────────────────────────────────── */}
            <Section title="Notas internas" icon={<FileText size={14} />}>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas visibles solo para el equipo administrativo…" rows={3} className="text-sm resize-none" />
              <div className="mt-2 flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={handleNotesSave} disabled={savingNotes} className="gap-1.5">
                  <Save size={13} /> {savingNotes ? "Guardando…" : notesSaved ? "¡Guardado!" : "Guardar notas"}
                </Button>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* ── Modal cancelar pedido (requiere nota) ──────────────────────── */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-vous-black/60" onClick={() => { setShowCancelConfirm(false); setCancelNote(""); }} />
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <AlertTriangle size={16} />
              <p className="font-nav text-[13px] uppercase tracking-wide font-semibold">Cancelar pedido</p>
            </div>
            <p className="font-sans text-sm text-vous-text-secondary mb-4">
              Cancelarás <strong>{order.orderNumber}</strong> y se repondrá el stock automáticamente.
            </p>
            <div className="space-y-1 mb-4">
              <Label className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
                Motivo de cancelación <span className="text-red-600">*</span>
              </Label>
              <Textarea
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder="Explica por qué se cancela este pedido…"
                rows={3}
                className="text-sm resize-none"
              />
            </div>
            <p className="font-sans text-xs text-vous-text-secondary mb-5 italic">Esta acción no se puede revertir.</p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => { setShowCancelConfirm(false); setCancelNote(""); }} disabled={saving} className="flex-1">
                No, mantener
              </Button>
              <Button variant="danger" size="sm" onClick={handleCancelConfirm} disabled={saving || !cancelNote.trim()} className="flex-1">
                {saving ? "Cancelando…" : "Sí, cancelar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
