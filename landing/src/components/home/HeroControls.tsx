"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroControlsProps {
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (idx: number) => void;
}

export function HeroControls({ total, current, onPrev, onNext, onSelect }: HeroControlsProps) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        className="text-vous-gray hover:text-vous-gold transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === current ? "bg-vous-gold" : "bg-vous-gray/30 hover:bg-vous-gray/50"
            }`}
            aria-label={`Ir al banner ${idx + 1}`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        className="text-vous-gray hover:text-vous-gold transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}
