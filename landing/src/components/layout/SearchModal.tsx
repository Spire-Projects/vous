"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContentRaw,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/catalogo?q=${encodeURIComponent(q)}`);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogPortal>
        <AnimatePresence>
          {open && (
            <>
              <DialogOverlay
                className="fixed inset-0 z-50 bg-vous-soft-black/50 backdrop-blur-sm"
                onClick={handleClose}
              />

              <DialogContentRaw asChild>
                <motion.div
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ type: "tween", duration: 0.25 }}
                  className="fixed top-0 left-0 right-0 z-50 bg-vous-warm-white border-b border-vous-gold/20 px-5 md:px-20 py-5"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-[1440px] mx-auto flex items-center gap-4"
                  >
                    <Search size={20} strokeWidth={1.5} className="text-vous-gray shrink-0" />
                    <input
                      ref={inputRef}
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar productos, categorías, tendencias..."
                      className="flex-1 bg-transparent font-sans text-lg text-vous-soft-black placeholder:text-vous-gray outline-none"
                      aria-label="Buscar en VOUS"
                    />
                    <DialogClose
                      aria-label="Cerrar búsqueda"
                      className="text-vous-gray hover:text-vous-soft-black transition-colors"
                    >
                      <X size={20} strokeWidth={1.5} />
                    </DialogClose>
                  </form>
                </motion.div>
              </DialogContentRaw>
            </>
          )}
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
}
