"use client";

import { MessageCircle, X } from "lucide-react";
import type { Order } from "@/domain/entities/order.entity";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContentRaw,
} from "@/components/ui/dialog";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  qr: "QR / E-Transfer",
  libelula: "Libélula",
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59170000000";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const createdDate = new Date(order.createdAt).toLocaleDateString("es-BO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const whatsappMsg = encodeURIComponent(
    `Hola VOUS, tengo una consulta sobre mi pedido ${order.orderNumber}.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContentRaw className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Panel */}
          <div className="bg-white w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-black/10 sticky top-0 bg-white z-10">
              <div>
                <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-0.5">
                  Detalle del Pedido
                </p>
                <h2 className="font-serif text-xl text-black">{order.orderNumber}</h2>
                <p className="font-sans text-xs text-black/50 mt-0.5">{createdDate}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <OrderStatusBadge status={order.status} />
                <DialogClose className="p-1.5 text-black/50 hover:text-black transition-colors">
                  <X size={18} />
                  <span className="sr-only">Cerrar</span>
                </DialogClose>
              </div>
            </div>

            <div className="px-6 py-6 space-y-7">
              {/* Timeline */}
              <section>
                <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-4">
                  Estado del Pedido
                </h3>
                <OrderStatusTimeline status={order.status} />
              </section>

              {/* Items */}
              <section>
                <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-4">
                  Productos
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex gap-3 py-3 border-b border-black/10 last:border-0"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-14 h-18 object-cover border border-black/10 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-18 shrink-0 bg-black/10" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm text-black leading-snug">
                          {item.productName}
                        </p>
                        {item.variantDescription && (
                          <p className="font-sans text-xs text-black/50 mt-0.5">
                            {item.variantDescription}
                          </p>
                        )}
                        <p className="font-sans text-xs text-black/50 mt-0.5">×{item.quantity}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-sans text-sm text-black font-medium">
                          Bs. {item.subtotal.toLocaleString("es-BO")}
                        </p>
                        <p className="font-sans text-xs text-black/50">
                          c/u Bs. {item.unitPrice.toLocaleString("es-BO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-3 space-y-1.5 font-sans text-sm">
                  {order.discountAmount && order.discountAmount > 0 ? (
                    <>
                      <div className="flex justify-between text-black/50">
                        <span>Subtotal</span>
                        <span>Bs. {order.subtotal.toLocaleString("es-BO")}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Descuento {order.discountCode && `(${order.discountCode})`}</span>
                        <span>− Bs. {order.discountAmount.toLocaleString("es-BO")}</span>
                      </div>
                    </>
                  ) : null}
                  <div className="flex justify-between text-black font-medium border-t border-black/10 pt-2 mt-2">
                    <span className="font-nav tracking-[0.1em] uppercase">Total</span>
                    <span className="font-serif text-lg">
                      Bs. {order.total.toLocaleString("es-BO")}
                    </span>
                  </div>
                </div>
              </section>

              {/* Shipping info */}
              {order.shippingInfo && (
                <section>
                  <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-3">
                    Envío
                  </h3>
                  <div className="bg-white p-4 space-y-1.5">
                    <p className="font-sans text-sm text-black">{order.shippingInfo.fullName}</p>
                    <p className="font-sans text-xs text-black/50">
                      {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                      {order.shippingInfo.department}
                    </p>
                    <p className="font-sans text-xs text-black/50">
                      Tel. {order.shippingInfo.phone}
                    </p>
                    {order.shippingInfo.carrier && (
                      <p className="font-sans text-xs text-black">
                        Transportista: {order.shippingInfo.carrier}
                      </p>
                    )}
                    {order.shippingInfo.trackingInfo && (
                      <p className="font-sans text-xs text-black/50">
                        Seguimiento: {order.shippingInfo.trackingInfo}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Payment */}
              <section>
                <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-3">
                  Pago
                </h3>
                <p className="font-sans text-sm text-black">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                </p>
              </section>

              {/* Admin notes */}
              {order.adminNotes && (
                <section>
                  <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50 mb-2">
                    Nota
                  </h3>
                  <p className="font-sans text-sm text-black/50 italic">{order.adminNotes}</p>
                </section>
              )}

              {/* Contact support */}
              <section className="border-t border-black/10 pt-5">
                <p className="font-sans text-xs text-black/50 mb-3">
                  ¿Tienes alguna consulta sobre este pedido?
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-black text-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors"
                >
                  <MessageCircle size={13} />
                  Contactar soporte
                </a>
              </section>
            </div>
          </div>
        </DialogContentRaw>
      </DialogPortal>
    </Dialog>
  );
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}
