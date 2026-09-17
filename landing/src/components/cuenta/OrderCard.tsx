import { ChevronRight } from "lucide-react";
import type { Order } from "@/domain/entities/order.entity";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
  onViewDetail: (order: Order) => void;
}

export function OrderCard({ order, onViewDetail }: OrderCardProps) {
  const createdDate = new Date(order.createdAt).toLocaleDateString("es-BO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const firstItem = order.items[0];
  const extraItems = order.items.length - 1;

  return (
    <button
      onClick={() => onViewDetail(order)}
      className="w-full text-left border border-black/10 p-4 sm:p-5 flex gap-4 hover:border-black transition-colors group"
    >
      {/* Product thumbnail */}
      {firstItem?.imageUrl ? (
        <img
          src={firstItem.imageUrl}
          alt={firstItem.productName}
          className="w-16 h-20 object-cover shrink-0 border border-black/10"
        />
      ) : (
        <div className="w-16 h-20 shrink-0 bg-black/10" />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="font-nav text-[10px] tracking-[0.18em] uppercase text-black/50">
              {order.orderNumber}
            </p>
            <p className="font-serif text-sm text-black mt-0.5 truncate">
              {firstItem?.productName ?? "Pedido"}
              {extraItems > 0 && (
                <span className="font-sans text-xs text-black/50"> +{extraItems} más</span>
              )}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex items-end justify-between mt-3 gap-2">
          <div>
            <p className="font-sans text-xs text-black/50">{createdDate}</p>
            <p className="font-serif text-base text-black mt-0.5">
              Bs. {order.total.toLocaleString("es-BO")}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-black/50 group-hover:text-black transition-colors shrink-0"
          />
        </div>
      </div>
    </button>
  );
}
