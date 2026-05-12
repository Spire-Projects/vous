'use client'

import { X, Minus, Plus } from 'lucide-react'

interface CartItemProps {
  name: string
  variant: string
  price: string
  qty: number
  bg: string
  onRemove: () => void
  onQty: (delta: number) => void
}

export function CartItemRow({ name, variant, price, qty, bg, onRemove, onQty }: CartItemProps) {
  return (
    <div className="flex gap-5 py-6 border-b border-vous-gray-light/40">
      <div className={`w-24 h-32 shrink-0 bg-gradient-to-b ${bg}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-vous-soft-black leading-tight">{name}</h3>
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mt-1">
              Variante: {variant}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-vous-gray hover:text-vous-soft-black transition-colors shrink-0"
            aria-label="Eliminar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-vous-gray-light">
            <button
              onClick={() => onQty(-1)}
              className="w-8 h-8 flex items-center justify-center text-vous-gray hover:text-vous-soft-black transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center font-sans text-sm text-vous-soft-black">{qty}</span>
            <button
              onClick={() => onQty(1)}
              className="w-8 h-8 flex items-center justify-center text-vous-gray hover:text-vous-soft-black transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
          <p className="font-serif text-lg text-vous-soft-black">{price}</p>
        </div>
      </div>
    </div>
  )
}
