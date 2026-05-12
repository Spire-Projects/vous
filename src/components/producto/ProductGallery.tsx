'use client'

import { useState } from 'react'

const THUMBNAILS = [
  { id: 1, bg: 'from-[#b8b0a4] to-[#8a8278]' },
  { id: 2, bg: 'from-[#d4cfc6] to-[#a09890]' },
  { id: 3, bg: 'from-[#8a8278] to-[#6b6360]' },
]

export function ProductGallery() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 flex-1">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3">
        {THUMBNAILS.map(({ id, bg }, i) => (
          <button
            key={id}
            onClick={() => setActive(i)}
            className={`w-16 h-20 md:w-20 md:h-24 bg-gradient-to-b ${bg} shrink-0 border-2 transition-colors ${
              active === i ? 'border-vous-gold' : 'border-transparent hover:border-vous-gray-light'
            }`}
          />
        ))}
      </div>

      {/* Main image */}
      <div
        className={`flex-1 aspect-[3/4] bg-gradient-to-b ${THUMBNAILS[active].bg} relative`}
      />
    </div>
  )
}
