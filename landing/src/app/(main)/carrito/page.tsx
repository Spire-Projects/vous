"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { CartItemRow } from "@/components/carrito/CartItemRow";
import { CartSummary } from "@/components/carrito/CartSummary";
import { StockValidationDialog } from "@/components/checkout";
import { useCart } from "@/hooks/useCart";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { validateStock, type OutOfStockItem } from "@/application/use-cases/order/validate-stock";

export default function CarritoPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [stockErrors, setStockErrors] = useState<OutOfStockItem[]>([]);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);

  const fmt = (n: number) => `Bs. ${n.toLocaleString("es-BO")}`;

  useEffect(() => {
    let cancelled = false;
    validateStock(firestoreProductRepository, items).then((res) => {
      if (!cancelled) setStockErrors(res);
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const handleCheckout = async () => {
    const outOfStock = await validateStock(firestoreProductRepository, items);
    if (outOfStock.length > 0) {
      setStockErrors(outOfStock);
      setStockDialogOpen(true);
      return;
    }
    router.push("/checkout");
  };

  const handleAdjustStock = () => {
    stockErrors.forEach((item) => {
      if (item.available <= 0) removeItem(item.id);
      else updateQuantity(item.id, item.available);
    });
    setStockErrors([]);
    setStockDialogOpen(false);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-6 px-5 text-center">
        <ShoppingBag size={48} className="text-black/20" strokeWidth={1} />
        <p className="font-serif text-2xl text-black">Tu carrito está vacío</p>
        <p className="font-sans text-sm text-black/50">
          Explora nuestra colección y agrega lo que más te guste.
        </p>
        <Link
          href="/catalogo"
          className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-black text-white px-8 py-3 hover:bg-black/80 transition-colors"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-black mb-10">Carrito de Compras</h1>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Items list */}
          <div className="flex-1 min-w-0">
            {items.map((item) => {
              const warning = stockErrors.find((e) => e.id === item.id);
              return (
                <CartItemRow
                  key={item.id}
                  name={item.name}
                  variant={[item.size, item.color].filter(Boolean).join(" / ") || "Sin variante"}
                  price={fmt(item.price * item.quantity)}
                  qty={item.quantity}
                  imageUrl={item.image}
                  stockWarning={warning ? { available: warning.available } : undefined}
                  onRemove={() => removeItem(item.id)}
                  onQty={(delta) => updateQuantity(item.id, Math.max(1, item.quantity + delta))}
                />
              );
            })}
          </div>

          <CartSummary
            subtotal={fmt(totalPrice)}
            total={fmt(totalPrice)}
            onCheckout={handleCheckout}
            hasStockErrors={stockErrors.length > 0}
          />
        </div>
      </div>

      <StockValidationDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        items={stockErrors}
        onAdjustStock={handleAdjustStock}
      />
    </div>
  );
}
