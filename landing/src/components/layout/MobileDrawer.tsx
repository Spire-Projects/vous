"use client";

import Link from "next/link";
import { X, User } from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContentRaw,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { NAV_LINKS } from "./Header/HeaderNav";
import { useAuthContext } from "@/context/AuthContext";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  pathname?: string;
}

export function MobileDrawer({ open, onClose, pathname = "/" }: MobileDrawerProps) {
  const { user } = useAuthContext();

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogPortal>
        <AnimatePresence>
          {open && (
            <>
              <DialogOverlay
                className="fixed inset-0 z-50 bg-vous-soft-black/40 backdrop-blur-sm"
                onClick={onClose}
              />

              <DialogContentRaw asChild>
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.28 }}
                  className="fixed top-0 left-0 bottom-0 z-50 w-[80vw] max-w-[320px] bg-vous-cream flex flex-col"
                  aria-label="Menú de navegación"
                >
                  <DialogTitle className="sr-only">Menú de navegación</DialogTitle>
                  <div className="flex items-center justify-between px-6 py-5 border-b border-vous-gray-light/50">
                    <span className="font-serif text-2xl font-bold tracking-[0.08em] text-vous-soft-black">
                      VOUS
                    </span>
                    <DialogClose
                      aria-label="Cerrar menú"
                      className="text-vous-soft-black hover:text-vous-gold transition-colors"
                    >
                      <X size={22} strokeWidth={1.5} />
                    </DialogClose>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
                    {NAV_LINKS.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={clsx(
                          "block font-sans text-[13px] font-semibold tracking-[0.18em] py-3 border-b border-vous-gray-light/30 transition-colors duration-150",
                          pathname === href
                            ? "text-vous-gold"
                            : "text-vous-soft-black hover:text-vous-gold"
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>

                  <div className="px-6 pb-8">
                    {user ? (
                      <Link
                        href="/cuenta"
                        onClick={onClose}
                        className="flex items-center gap-2 font-sans text-sm font-medium text-vous-soft-black hover:text-vous-gold transition-colors"
                      >
                        <User size={16} />
                        Mi Cuenta
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={onClose}
                        className="block w-full text-center bg-vous-soft-black text-white font-sans text-[12px] font-semibold tracking-[0.15em] py-3 hover:bg-vous-gold transition-colors duration-200"
                      >
                        INICIAR SESIÓN
                      </Link>
                    )}
                  </div>
                </motion.aside>
              </DialogContentRaw>
            </>
          )}
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
}
