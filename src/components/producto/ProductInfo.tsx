'use client'

import { useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'

const SIZES = ['XS', 'S', 'M', 'L']
const COLORS = ['#1a1a18', '#b8b0a4', '#c9a84c', '#6b5a3a']

export function ProductInfo() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(0)

  return (
    <div className="flex flex-col gap-6 max-w-md w-full">
      {/* Breadcrumb */}
      <p className="font-sans text-xs text-vous-gray tracking-wide">
        <span>Catálogo</span>
        <span className="mx-2 text-vous-gray-light">/</span>
        <span>Sacos y Abrigos</span>
        <span className="mx-2 text-vous-gray-light">/</span>
        <span className="text-vous-soft-black">Sobretodo de Lana Estructurado</span>
      </p>

      <div>
        <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold mb-1">
          Colección Invierno
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black leading-tight">
          Sobretodo de Lana Estructurado
        </h1>
        <p className="font-serif text-2xl text-vous-soft-black mt-3">Bs. 890</p>
      </div>

      {/* Color */}
      <div>
        <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray mb-2">Color</p>
        <div className="flex gap-2.5">
          {COLORS.map((c, i) => (
            <button
              key={c}
              onClick={() => setSelectedColor(i)}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                selectedColor === i ? 'border-vous-gold scale-110' : 'border-transparent hover:border-vous-gray-light'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Talla */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray">Talla</p>
          <button className="font-sans text-xs text-vous-gold underline underline-offset-2">
            Guía de tallas
          </button>
        </div>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`w-11 h-11 font-sans text-sm border transition-colors ${
                selectedSize === s
                  ? 'bg-vous-soft-black text-white border-vous-soft-black'
                  : 'border-vous-gray-light text-vous-gray hover:border-vous-soft-black hover:text-vous-soft-black'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-vous-soft-black text-white font-nav text-[12px] font-semibold tracking-[0.15em] uppercase py-3.5 hover:bg-vous-gray-dark transition-colors">
          <ShoppingBag size={15} />
          Agregar al Carrito
        </button>
        <button className="w-12 h-12 border border-vous-gray-light flex items-center justify-center text-vous-gray hover:border-vous-gold hover:text-vous-gold transition-colors">
          <Heart size={16} />
        </button>
      </div>

      {/* Detalles */}
      <div className="border-t border-vous-gray-light/40 pt-5 grid grid-cols-3 gap-4">
        {[['Corte', 'Arquitectónico'], ['Tela', 'Lana Orgánica'], ['Largo', '110cm']].map(([k, v]) => (
          <div key={k}>
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1">{k}</p>
            <p className="font-sans text-sm text-vous-soft-black">{v}</p>
          </div>
        ))}
      </div>

      <p className="font-sans text-sm text-vous-gray leading-relaxed border-t border-vous-gray-light/40 pt-5">
        Una pieza esencial de nuestra colección de invierno. Diseñado con líneas precisas
        y una estructura que define la silueta contemporánea, este sobretodo fusiona la
        funcionalidad urbana con el lujo editorial.
      </p>
    </div>
  )
}
