"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";
import { CartItemRow } from "@/components/carrito/CartItemRow";
import { CartSummary } from "@/components/carrito/CartSummary";

const RELATED = [
  { name: "Vestido Solsticio", price: "Bs. 210", bg: "from-[#d4cfc6] to-[#b0a898]" },
  { name: "Chaqueta Denim Estructura", price: "Bs. 195", bg: "from-[#2a2015] to-[#1a1a18]" },
  { name: "Bolso Atelier Cuero", price: "Bs. 480", bg: "from-[#6b5a3a] to-[#3d2e15]" },
];

interface Item {
  name: string;
  variant: string;
  price: number;
  qty: number;
  bg: string;
}

const INITIAL_ITEMS: Item[] = [
  {
    name: "Camisa Lino Estructural",
    variant: "Blanco Óptico / Medium",
    price: 185,
    qty: 1,
    bg: "from-[#fdfaf5] to-[#e8e2d8]",
  },
  {
    name: "Blazer Sastre Onyx",
    variant: "Negro Mate / Small",
    price: 340,
    qty: 1,
    bg: "from-[#1a1a18] to-[#0d0d0b]",
  },
];

export default function CarritoPage() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const changeQty = (i: number, delta: number) =>
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const fmt = (n: number) => `Bs. ${n.toLocaleString("es-BO")}`;

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-vous-soft-black mb-10">
          Carrito de Compras
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-sans text-vous-gray mb-6">Tu carrito está vacío.</p>
            <Link
              href="/catalogo"
              className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white px-8 py-3 hover:bg-vous-gray-dark transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Items */}
            <div className="flex-1 min-w-0">
              {items.map((item, i) => (
                <CartItemRow
                  key={item.name}
                  {...item}
                  price={fmt(item.price * item.qty)}
                  onRemove={() => remove(i)}
                  onQty={(d) => changeQty(i, d)}
                />
              ))}
              <button className="mt-5 flex items-center gap-2 font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray hover:text-vous-gold transition-colors">
                <Gift size={14} />
                Añadir nota de regalo
              </button>

              {/* También te podría gustar */}
              <div className="mt-14">
                <h2 className="font-serif text-xl text-vous-soft-black mb-6">
                  También te podría gustar
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {RELATED.map(({ name, price, bg }) => (
                    <div key={name} className="group cursor-pointer">
                      <div className={`aspect-[3/4] bg-gradient-to-b ${bg} mb-3`} />
                      <h3 className="font-serif text-sm text-vous-soft-black group-hover:text-vous-gold transition-colors">
                        {name}
                      </h3>
                      <p className="font-sans text-xs text-vous-gray mt-0.5">{price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CartSummary subtotal={fmt(subtotal)} total={fmt(subtotal)} />
          </div>
        )}
      </div>
    </div>
  );
}
