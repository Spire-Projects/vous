"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex-1">
        <div className="aspect-[3/4] bg-gradient-to-b from-[#b8b0a4] to-[#8a8278]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 flex-1">
      <div className="flex md:flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={active === i ? true : undefined}
            className={`w-16 h-20 md:w-20 md:h-24 shrink-0 border-2 transition-colors overflow-hidden ${
              active === i ? "border-vous-gold" : "border-transparent hover:border-vous-gray-light"
            }`}
          >
            <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="flex-1 aspect-[3/4] relative overflow-hidden bg-vous-cream">
        <img src={images[active]} alt={name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
