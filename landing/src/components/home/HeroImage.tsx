"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HeroImageProps {
  imageUrl: string;
  alt: string;
}

export function HeroImage({ imageUrl, alt }: HeroImageProps) {
  return (
    <div className="relative w-full aspect-[4/5] max-w-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageUrl || "fallback"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4cfc6] via-[#b8b0a4] to-[#8a8278]" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-vous-gold/30 hidden md:block" />
    </div>
  );
}
