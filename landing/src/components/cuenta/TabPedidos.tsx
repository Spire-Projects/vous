"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, PackageSearch } from "lucide-react";
import { OrderCard } from "@/components/cuenta/OrderCard";
import { OrderDetailModal } from "@/components/cuenta/OrderDetailModal";
import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/domain/entities/order.entity";

const PAGE_SIZE = 5;

export function TabPedidos({ userId }: { userId: string }) {
  const { orders, loading, error } = useOrders(userId);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-vous-gray">
        <Loader2 size={22} className="animate-spin" />
        <p className="font-sans text-sm">Cargando pedidos…</p>
      </div>
    );
  }

  if (error) {
    return <p className="font-sans text-sm text-red-600 py-8">{error}</p>;
  }

  const visible = orders.slice(0, displayCount);
  const hasMore = displayCount < orders.length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl text-vous-soft-black">Mis Pedidos</h2>
        {orders.length > 0 && (
          <p className="font-sans text-xs text-vous-gray">
            {orders.length} pedido{orders.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-vous-gray border border-vous-gray-light/40">
          <PackageSearch size={36} strokeWidth={1} />
          <div className="text-center">
            <p className="font-sans text-sm">Todavía no tienes pedidos.</p>
            <p className="font-sans text-xs mt-1">
              Cuando realices tu primera compra aparecerá aquí.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} onViewDetail={setSelectedOrder} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors"
              >
                Cargar más ({orders.length - visible.length} restantes)
              </button>
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
