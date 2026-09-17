"use client";

import Link from "next/link";
import { AlertTriangle, PackageX, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OutOfStockItem } from "@/application/use-cases/order/validate-stock";

interface StockValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OutOfStockItem[];
  onAdjustStock?: () => void;
}

export function StockValidationDialog({
  open,
  onOpenChange,
  items,
  onAdjustStock,
}: StockValidationDialogProps) {
  if (items.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2 pb-2 border-b border-vous-border">
          <div className="flex items-center gap-2.5 text-amber-700">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <DialogTitle className="text-lg font-serif">Disponibilidad de Stock</DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            Algunos productos en tu orden no tienen stock suficiente. Ajusta las cantidades para
            continuar con tu compra.
          </DialogDescription>
        </DialogHeader>

        {/* List of out-of-stock items */}
        <div className="divide-y divide-vous-border my-2">
          {items.map((item) => {
            const isZero = item.available <= 0;
            return (
              <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-serif text-sm text-vous-soft-black leading-tight">
                      {item.productName}
                    </p>
                    <Badge variant={isZero ? "out_of_stock" : "warning"}>
                      {isZero ? "Agotado" : "Stock limitado"}
                    </Badge>
                  </div>
                  {item.variantDescription && (
                    <p className="font-sans text-xs text-vous-gray mb-1">
                      Variante: {item.variantDescription}
                    </p>
                  )}
                  <p className="font-sans text-xs text-vous-gray">
                    Solicitado:{" "}
                    <span className="font-semibold text-vous-soft-black">{item.requested}</span> ·
                    Disponible:{" "}
                    <span className={`font-semibold ${isZero ? "text-red-600" : "text-amber-700"}`}>
                      {item.available}
                    </span>
                  </p>
                </div>
                {isZero && <PackageX size={18} className="text-red-500 shrink-0 mt-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-vous-border">
          {onAdjustStock && (
            <Button
              variant="default"
              size="default"
              onClick={onAdjustStock}
              className="flex-1 justify-center gap-1.5"
            >
              <Check size={14} />
              Ajustar al stock disponible
            </Button>
          )}
          <Button asChild variant="outline" size="default" className="flex-1 justify-center">
            <Link href="/carrito" onClick={() => onOpenChange(false)}>
              Modificar carrito
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
