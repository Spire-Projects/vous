'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const CATEGORIES = [
  { label: 'Todas las Piezas', count: 42 },
  { label: 'Ropa de Abrigo', count: null },
  { label: 'Tejidos', count: 12 },
  { label: 'Accesorios', count: 8 },
]

const SIZES = ['XS', 'S', 'M', 'L']
const MATERIALS = ['Lana Orgánica', 'Mezclilla Japonesa', 'Algodón Pima']

export function CatalogFilters() {
  const [activeCategory, setActiveCategory] = useState('Todas las Piezas')
  const [activeSizes, setActiveSizes] = useState<string[]>([])

  const toggleSize = (size: string) =>
    setActiveSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )

  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-8">
      <div>
        <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
          Categoría
        </h3>
        <ul className="space-y-2">
          {CATEGORIES.map(({ label, count }) => (
            <li key={label}>
              <button
                onClick={() => setActiveCategory(label)}
                className={`w-full text-left font-sans text-sm transition-colors ${
                  activeCategory === label
                    ? 'text-vous-soft-black font-medium'
                    : 'text-vous-gray hover:text-vous-soft-black'
                }`}
              >
                {label}
                {count !== null && (
                  <span className="ml-1 text-vous-gray-light">({count})</span>
                )}
                {activeCategory === label && (
                  <span className="ml-1 text-vous-gold">●</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
          Talla
        </h3>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 font-sans text-xs border transition-colors ${
                activeSizes.includes(size)
                  ? 'bg-vous-soft-black text-white border-vous-soft-black'
                  : 'border-vous-gray-light text-vous-gray hover:border-vous-soft-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
          Material
        </h3>
        <ul className="space-y-3">
          {MATERIALS.map((mat) => (
            <li key={mat} className="flex items-center gap-2">
              <Checkbox id={`mat-${mat}`} />
              <Label htmlFor={`mat-${mat}`} className="font-sans text-sm normal-case tracking-normal text-vous-gray cursor-pointer">
                {mat}
              </Label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
          Rango de Precios
        </h3>
        <div className="flex items-center justify-between font-sans text-xs text-vous-gray mb-2">
          <span>Bs. 100</span>
          <span>Bs. 1.200</span>
        </div>
        <input type="range" min={100} max={1200} className="w-full accent-vous-gold" />
      </div>
    </aside>
  )
}
