import { Check } from "lucide-react";
import type { OrderStatus } from "@/domain/entities/order.entity";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Pedido recibido" },
  { status: "payment_sent", label: "Pago enviado" },
  { status: "verifying_payment", label: "Verificando" },
  { status: "confirmed", label: "Confirmado" },
  { status: "preparing", label: "Preparando" },
  { status: "shipped", label: "Enviado" },
  { status: "delivered", label: "Entregado" },
];

const ORDER: Record<OrderStatus, number> = {
  pending: 0,
  payment_sent: 1,
  verifying_payment: 2,
  confirmed: 3,
  preparing: 4,
  shipped: 5,
  delivered: 6,
  cancelled: -1,
};

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="font-sans text-sm text-red-600">Este pedido fue cancelado.</p>;
  }

  const currentIdx = ORDER[status] ?? 0;

  return (
    <ol className="flex items-start gap-0">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const pending = idx > currentIdx;

        return (
          <li key={step.status} className="flex-1 flex flex-col items-center gap-1.5 relative">
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`absolute left-1/2 top-[14px] h-px w-full z-0 ${
                  done ? "bg-black" : "bg-black/10"
                }`}
              />
            )}
            {/* Circle */}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold transition-colors ${
                done
                  ? "bg-black border-black text-white"
                  : active
                    ? "bg-black border-black text-white"
                    : pending
                      ? "bg-white border-black/10 text-black/20"
                      : ""
              }`}
            >
              {done ? <Check size={11} strokeWidth={3} /> : <span>{idx + 1}</span>}
            </div>
            {/* Label */}
            <span
              className={`font-sans text-[10px] text-center leading-tight ${
                active ? "text-black font-semibold" : done ? "text-black" : "text-black/20"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
