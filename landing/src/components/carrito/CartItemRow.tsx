"use client";

import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  name: string;
  variant: string;
  price: string;
  qty: number;
  imageUrl?: string;
  onRemove: () => void;
  onQty: (delta: number) => void;
}

export function CartItemRow({
  name,
  variant,
  price,
  qty,
  imageUrl,
  onRemove,
  onQty,
}: CartItemProps) {
  return (
    <div className="flex gap-5 py-6 border-b border-black/10">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-32 shrink-0 object-cover border border-black/10"
        />
      ) : (
        <div className="w-24 h-32 shrink-0 bg-white border border-black/10" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-black leading-tight">{name}</h3>
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mt-1">
              {variant}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label="Eliminar"
            className="text-black/50 hover:text-black border-none pb-0 shrink-0"
          >
            <X size={15} />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-black/10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQty(-1)}
              className="w-8 h-8 text-black/50 hover:text-black border-none pb-0"
            >
              <Minus size={13} />
            </Button>
            <span className="w-8 text-center font-sans text-sm text-black">{qty}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQty(1)}
              className="w-8 h-8 text-black/50 hover:text-black border-none pb-0"
            >
              <Plus size={13} />
            </Button>
          </div>
          <p className="font-serif text-lg text-black">{price}</p>
        </div>
      </div>
    </div>
  );
}
