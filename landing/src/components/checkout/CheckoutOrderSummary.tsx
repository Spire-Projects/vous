import Link from "next/link";
import type { CartItem } from "@/types/cart.types";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

const fmt = (n: number) => `Bs. ${n.toLocaleString("es-BO")}`;

export function CheckoutOrderSummary({ items, subtotal }: CheckoutOrderSummaryProps) {
  return (
    <div className="lg:w-80 shrink-0">
      <div className="bg-vous-cream p-6 sticky top-24">
        <h2 className="font-serif text-xl text-vous-soft-black mb-6">Resumen del Pedido</h2>

        {items.length === 0 ? (
          <p className="font-sans text-sm text-vous-gray">
            Tu carrito está vacío.{" "}
            <Link href="/catalogo" className="underline">
              Ver catálogo
            </Link>
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover shrink-0 border border-vous-gray-light/30"
                    />
                  ) : (
                    <div className="w-12 h-16 shrink-0 bg-vous-soft-black/10" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm text-vous-soft-black leading-snug truncate">
                      {item.name}
                    </p>
                    {(item.size ?? item.color) && (
                      <p className="font-sans text-xs text-vous-gray">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <p className="font-sans text-xs text-vous-gray">×{item.quantity}</p>
                  </div>
                  <p className="font-serif text-sm text-vous-soft-black shrink-0 pt-0.5">
                    {fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-vous-gray-light/40 pt-4">
              <div className="flex justify-between text-vous-soft-black font-medium">
                <span className="font-nav tracking-[0.1em] uppercase text-sm">Total</span>
                <span className="font-serif text-lg">{fmt(subtotal)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
