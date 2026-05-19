"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartItemRow } from "@/components/carrito/CartItemRow";
import { CartSummary } from "@/components/carrito/CartSummary";
import { useCart } from "@/hooks/useCart";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const fmt = (n: number) => `Bs. ${n.toLocaleString("es-BO")}`;

  if (items.length === 0) {
    return (
      <div className="bg-vous-warm-white min-h-screen flex flex-col items-center justify-center gap-6 px-5 text-center">
        <ShoppingBag size={48} className="text-vous-gray-light" strokeWidth={1} />
        <p className="font-serif text-2xl text-vous-soft-black">Tu carrito está vacío</p>
        <p className="font-sans text-sm text-vous-gray">
          Explora nuestra colección y agrega lo que más te guste.
        </p>
        <Link
          href="/catalogo"
          className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white px-8 py-3 hover:bg-vous-gray-dark transition-colors"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-vous-soft-black mb-10">
          Carrito de Compras
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Items list */}
          <div className="flex-1 min-w-0">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                name={item.name}
                variant={[item.size, item.color].filter(Boolean).join(" / ") || "Sin variante"}
                price={fmt(item.price * item.quantity)}
                qty={item.quantity}
                imageUrl={item.image}
                onRemove={() => removeItem(item.id)}
                onQty={(delta) => updateQuantity(item.id, Math.max(1, item.quantity + delta))}
              />
            ))}
          </div>

          <CartSummary subtotal={fmt(totalPrice)} total={fmt(totalPrice)} />
        </div>
      </div>
    </div>
  );
}
