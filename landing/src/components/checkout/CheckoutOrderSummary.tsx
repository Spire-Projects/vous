"use client";

import Link from "next/link";
import { AlertTriangle, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/types/cart.types";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discountCode: string;
  onDiscountCodeChange: (code: string) => void;
  discountAmount: number;
  discountError: string | null;
  onApplyDiscount: () => Promise<void>;
  wholesaleErrors: string[];
  finalTotal: number;
}

const fmt = (n: number) => `Bs. ${n.toLocaleString("es-BO")}`;

export function CheckoutOrderSummary({
  items,
  subtotal,
  discountCode,
  onDiscountCodeChange,
  discountAmount,
  discountError,
  onApplyDiscount,
  wholesaleErrors,
  finalTotal,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="lg:w-80 shrink-0">
      <div className="bg-white p-6 sticky top-24 space-y-4">
        <h2 className="font-serif text-xl text-black">Resumen del Pedido</h2>

        {items.length === 0 ? (
          <p className="font-sans text-sm text-black/50">
            Tu carrito está vacío.{" "}
            <Link href="/catalogo" className="underline">
              Ver catálogo
            </Link>
          </p>
        ) : (
          <>
            {/* Wholesale errors */}
            {wholesaleErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-3 rounded space-y-1">
                {wholesaleErrors.map((err, i) => (
                  <p key={i} className="text-[11px] text-red-700 font-sans flex items-start gap-1">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* Items list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover shrink-0 border border-black/10"
                    />
                  ) : (
                    <div className="w-12 h-16 shrink-0 bg-black/10" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm text-black leading-snug truncate">
                      {item.name}
                    </p>
                    {(item.size ?? item.color) && (
                      <p className="font-sans text-xs text-black/50">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <p className="font-sans text-xs text-black/50">×{item.quantity}</p>
                  </div>
                  <p className="font-serif text-sm text-black shrink-0 pt-0.5">
                    {fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <div className="border-t border-black/10 pt-4 space-y-2">
              <p className="font-nav text-[10px] tracking-[0.1em] uppercase text-black/50">
                Código de descuento
              </p>
              <div className="flex gap-2">
                <Input
                  value={discountCode}
                  onChange={(e) => onDiscountCodeChange(e.target.value.toUpperCase())}
                  placeholder="Ej: VOUS10"
                  className="flex-1 uppercase text-[12px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onApplyDiscount();
                  }}
                />
                <button
                  onClick={() => void onApplyDiscount()}
                  className="shrink-0 bg-black text-white px-3 py-1.5 text-[10px] font-nav uppercase tracking-wider hover:bg-black/80 transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {discountError && (
                <p className="text-[11px] text-red-600 font-sans">{discountError}</p>
              )}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[12px] font-sans text-green-700">
                  <span className="flex items-center gap-1">
                    <Percent size={12} />
                    Descuento aplicado
                  </span>
                  <span className="font-semibold">-{fmt(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-black/10 pt-4 space-y-1">
              <div className="flex justify-between text-black">
                <span className="font-nav tracking-[0.1em] uppercase text-[11px] text-black/50">
                  Subtotal
                </span>
                <span className="font-serif text-sm">{fmt(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span className="font-nav tracking-[0.1em] uppercase text-[11px]">Descuento</span>
                  <span className="font-serif text-sm">-{fmt(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-black font-medium pt-1">
                <span className="font-nav tracking-[0.1em] uppercase text-sm">Total</span>
                <span className="font-serif text-lg">{fmt(finalTotal)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
