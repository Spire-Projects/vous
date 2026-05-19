import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  MapPin,
  Package,
  FileText,
  Download,
  ExternalLink,
  Save,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getOrderStatusLabel } from "@/utils";
import type { Order, OrderStatus, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

// ── Status machine ──────────────────────────────────────────────────────────

const VALID_NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ["payment_sent"],
  payment_sent: ["verifying_payment"],
  verifying_payment: ["confirmed"],
  confirmed: ["preparing"],
  preparing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const CANCELABLE: OrderStatus[] = [
  "pending",
  "payment_sent",
  "verifying_payment",
  "confirmed",
  "preparing",
  "shipped",
];

const STATUS_BADGE: Record<OrderStatus, BadgeProps["variant"]> = {
  pending: "pending",
  payment_sent: "payment",
  verifying_payment: "verifying",
  confirmed: "confirmed",
  preparing: "preparing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

// ── Status flow indicator ───────────────────────────────────────────────────

const FLOW: OrderStatus[] = [
  "pending",
  "payment_sent",
  "verifying_payment",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

function StatusStepper({ status }: { status: OrderStatus }) {
  const currentIdx = FLOW.indexOf(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {FLOW.map((s, i) => {
        const done = !isCancelled && i <= currentIdx;
        const active = !isCancelled && i === currentIdx;
        return (
          <div key={s} className="flex items-center shrink-0">
            <div
              className={`flex flex-col items-center gap-1 ${active ? "opacity-100" : done ? "opacity-70" : "opacity-30"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${active ? "bg-vous-black scale-125" : done ? "bg-vous-black" : "bg-vous-border"}`}
              />
              <span className="font-nav text-[8px] tracking-wide uppercase whitespace-nowrap text-vous-gray">
                {getOrderStatusLabel(s)}
              </span>
            </div>
            {i < FLOW.length - 1 && (
              <div
                className={`h-px w-4 mx-1 mb-4 ${!isCancelled && i < currentIdx ? "bg-vous-black" : "bg-vous-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-vous-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-vous-gray">{icon}</span>
        <h3 className="font-nav text-[11px] uppercase tracking-[0.15em] text-vous-black">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ── Props ───────────────────────────────────────────────────────────────────

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (input: UpdateOrderStatusInput) => Promise<void>;
  onCancelWithRestore: (orderId: string, adminNotes?: string) => Promise<void>;
  onNotesUpdate: (orderId: string, notes: string) => Promise<void>;
}

// ── Main component ──────────────────────────────────────────────────────────

export function OrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
  onCancelWithRestore,
  onNotesUpdate,
}: OrderDetailDrawerProps) {
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | "">("");
  const [savingStatus, setSavingStatus] = useState(false);
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
      setPendingStatus("");
      setSavingStatus(false);
      setShowCancelConfirm(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => {
      if (notesSavedTimer.current) clearTimeout(notesSavedTimer.current);
    };
  }, []);

  if (!order) return null;

  const validNext = VALID_NEXT[order.status];
  const canCancel = CANCELABLE.includes(order.status);

  async function handleStatusSave() {
    if (!pendingStatus) return;
    setSavingStatus(true);
    try {
      await onStatusChange({ orderId: order!.id, status: pendingStatus });
      setPendingStatus("");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleCancelConfirm() {
    setSavingStatus(true);
    try {
      await onCancelWithRestore(order!.id, notes || undefined);
      setShowCancelConfirm(false);
    } finally {
      setSavingStatus(false);
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
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-vous-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[680px] bg-vous-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-vous-border shrink-0">
          <div>
            <p className="font-nav text-[11px] uppercase tracking-[0.15em] text-vous-gray">
              Pedido
            </p>
            <h2 className="font-serif text-xl font-medium text-vous-black mt-0.5">
              {order.orderNumber}
            </h2>
            <p className="font-sans text-xs text-vous-gray mt-1">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={STATUS_BADGE[order.status]}>{getOrderStatusLabel(order.status)}</Badge>
            <button
              onClick={onClose}
              className="text-vous-gray hover:text-vous-black transition-colors"
              aria-label="Cerrar panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress stepper */}
        <div className="px-6 py-3 border-b border-vous-border shrink-0 overflow-x-auto">
          <StatusStepper status={order.status} />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-5">
            {/* ── Estado ─────────────────────────────────────────────────── */}
            <Section title="Gestión de estado" icon={<Package size={14} />}>
              {validNext.length > 0 ? (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1.5 block">
                      Siguiente estado
                    </Label>
                    <Select
                      value={pendingStatus}
                      onValueChange={(v) => setPendingStatus(v as OrderStatus)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {validNext.map((s) => (
                          <SelectItem key={s} value={s}>
                            {getOrderStatusLabel(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleStatusSave}
                    disabled={!pendingStatus || savingStatus}
                    className="h-9"
                  >
                    {savingStatus ? "Guardando…" : "Guardar"}
                  </Button>
                </div>
              ) : (
                <p className="font-sans text-xs text-vous-gray">
                  {order.status === "delivered"
                    ? "Pedido entregado — estado final."
                    : "Pedido cancelado — estado final."}
                </p>
              )}

              {canCancel && (
                <div className="mt-4 pt-4 border-t border-vous-border">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={savingStatus}
                    className="gap-1.5"
                  >
                    <AlertTriangle size={13} /> Cancelar pedido
                  </Button>
                </div>
              )}
            </Section>

            {/* ── Cliente ─────────────────────────────────────────────────── */}
            <Section title="Cliente" icon={<User size={14} />}>
              <div className="grid grid-cols-2 gap-3 font-sans text-[13px]">
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                    Nombre
                  </p>
                  <p className="text-vous-black">{order.customer.name || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                    Email
                  </p>
                  <p className="text-vous-black break-all">{order.customer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                    Celular
                  </p>
                  <p className="text-vous-black">{order.customer.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                    Departamento
                  </p>
                  <p className="text-vous-black">{order.customer.department || "—"}</p>
                </div>
              </div>
            </Section>

            {/* ── Envío ───────────────────────────────────────────────────── */}
            {order.shippingInfo && (
              <Section title="Información de envío" icon={<MapPin size={14} />}>
                <div className="grid grid-cols-2 gap-3 font-sans text-[13px]">
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                      Tipo
                    </p>
                    <p className="text-vous-black capitalize">
                      {order.shippingInfo.shippingType === "local"
                        ? "Dentro del departamento"
                        : "Fuera del departamento"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                      Destinatario
                    </p>
                    <p className="text-vous-black">{order.shippingInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                      Ciudad / Depto.
                    </p>
                    <p className="text-vous-black">
                      {order.shippingInfo.city}, {order.shippingInfo.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                      Celular
                    </p>
                    <p className="text-vous-black">{order.shippingInfo.phone || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                      Dirección
                    </p>
                    <p className="text-vous-black">{order.shippingInfo.address || "—"}</p>
                  </div>
                  {order.shippingInfo.carrier && (
                    <div>
                      <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                        Transportista
                      </p>
                      <p className="text-vous-black">{order.shippingInfo.carrier}</p>
                    </div>
                  )}
                  {order.shippingInfo.trackingInfo && (
                    <div>
                      <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">
                        Tracking
                      </p>
                      <p className="text-vous-black">{order.shippingInfo.trackingInfo}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── Referencia transportista externo ───────────────────────── */}
            <Section title="Transportista externo" icon={<Truck size={14} />}>
              <p className="font-sans text-[11px] text-vous-gray mb-2">
                Referencia Yango u otro (opcional).
              </p>
              <p className="font-sans text-sm text-vous-black">
                {order.carrierRef || (
                  <span className="text-vous-gray italic">Sin referencia registrada.</span>
                )}
              </p>
            </Section>

            {/* ── Ítems del pedido ────────────────────────────────────────── */}
            <Section title="Ítems del pedido" icon={<Package size={14} />}>
              <div className="flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-14 object-cover border border-vous-border shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-14 bg-vous-cream border border-vous-border shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[13px] font-medium text-vous-black truncate">
                        {item.productName}
                      </p>
                      {item.variantDescription && (
                        <p className="font-sans text-[11px] text-vous-gray">
                          {item.variantDescription}
                        </p>
                      )}
                      <p className="font-sans text-[11px] text-vous-gray mt-0.5">
                        {item.quantity} × Bs. {item.unitPrice.toLocaleString("es-BO")}
                      </p>
                    </div>
                    <p className="font-nav text-[13px] font-semibold text-vous-black shrink-0">
                      Bs. {item.subtotal.toLocaleString("es-BO")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-vous-border font-sans text-[13px] flex flex-col gap-1.5">
                <div className="flex justify-between text-vous-gray">
                  <span>Subtotal</span>
                  <span>Bs. {order.subtotal.toLocaleString("es-BO")}</span>
                </div>
                {!!order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>
                      Descuento{order.discountCode ? ` (${order.discountCode})` : ""}
                    </span>
                    <span>-Bs. {order.discountAmount.toLocaleString("es-BO")}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-vous-black text-sm pt-1 border-t border-vous-border">
                  <span>Total</span>
                  <span>Bs. {order.total.toLocaleString("es-BO")}</span>
                </div>
                {order.isWholesale && (
                  <p className="font-nav text-[9px] uppercase tracking-wider text-vous-gold">
                    Precio mayorista
                  </p>
                )}
              </div>
            </Section>

            {/* ── Comprobante de pago ──────────────────────────────────────── */}
            <Section title="Comprobante de pago" icon={<FileText size={14} />}>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={order.paymentMethod === "qr" ? "gold" : "outline"}>
                  {order.paymentMethod === "qr" ? "QR / Transferencia" : "Libélula"}
                </Badge>
              </div>
              {order.paymentProof ? (
                <div className="flex flex-col gap-3">
                  <a
                    href={order.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={order.paymentProof}
                      alt="Comprobante de pago"
                      className="max-h-48 w-auto border border-vous-border object-contain"
                    />
                  </a>
                  <div className="flex gap-2">
                    <a
                      href={order.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-gray hover:text-vous-black transition-colors"
                    >
                      <ExternalLink size={12} /> Ver en nueva pestaña
                    </a>
                    <a
                      href={order.paymentProof}
                      download
                      className="inline-flex items-center gap-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-gray hover:text-vous-black transition-colors"
                    >
                      <Download size={12} /> Descargar
                    </a>
                  </div>
                </div>
              ) : (
                <p className="font-sans text-[13px] text-vous-gray italic">
                  El cliente aún no ha subido un comprobante.
                </p>
              )}
            </Section>

            {/* ── Notas del administrador ─────────────────────────────────── */}
            <Section title="Notas internas" icon={<FileText size={14} />}>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas visibles solo para el equipo administrativo…"
                rows={3}
                className="text-sm resize-none"
              />
              <div className="mt-2 flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNotesSave}
                  disabled={savingNotes}
                  className="gap-1.5"
                >
                  <Save size={13} />
                  {savingNotes ? "Guardando…" : notesSaved ? "¡Guardado!" : "Guardar notas"}
                </Button>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* ── Confirm cancel dialog ──────────────────────────────────────────── */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-vous-black/60" onClick={() => setShowCancelConfirm(false)} />
          <div className="relative bg-vous-white border border-vous-border p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <AlertTriangle size={16} />
              <p className="font-nav text-[13px] uppercase tracking-wide font-semibold">
                Cancelar pedido
              </p>
            </div>
            <p className="font-sans text-sm text-vous-gray mb-2">
              Esta acción cancelará el pedido <strong>{order.orderNumber}</strong> y repondrá
              automáticamente el stock de todos los productos.
            </p>
            <p className="font-sans text-xs text-vous-gray mb-5 italic">
              Esta acción no se puede revertir.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(false)}
                disabled={savingStatus}
                className="flex-1"
              >
                No, mantener
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancelConfirm}
                disabled={savingStatus}
                className="flex-1"
              >
                {savingStatus ? "Cancelando…" : "Sí, cancelar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
