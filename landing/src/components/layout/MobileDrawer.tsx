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
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
              />

              <DialogContentRaw asChild>
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.28 }}
                  className="fixed top-0 left-0 bottom-0 z-50 w-[80vw] max-w-[320px] bg-white flex flex-col shadow-xl"
                  aria-label="Menú de navegación"
                >
                  <DialogTitle className="sr-only">Menú de navegación</DialogTitle>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
                    <span className="font-serif text-xl font-bold tracking-tight text-black">
                      VOUS
                    </span>
                    <DialogClose
                      aria-label="Cerrar menú"
                      className="text-black hover:text-black/60 transition-colors duration-300 p-1"
                    >
                      <X size={20} strokeWidth={1.5} />
                    </DialogClose>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-0">
                    {NAV_LINKS.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={clsx(
                          "block font-sans text-[13px] font-medium tracking-wide py-3.5 border-b border-black/5 transition-colors duration-200",
                          pathname === href
                            ? "text-black font-semibold"
                            : "text-black/60 hover:text-black"
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>

                  <div className="px-5 pb-6">
                    {user ? (
                      <Link
                        href="/cuenta"
                        onClick={onClose}
                        className="flex items-center gap-2 font-sans text-sm font-medium text-black hover:text-black/60 transition-colors duration-300"
                      >
                        <User size={16} />
                        Mi Cuenta
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={onClose}
                        className="block w-full text-center bg-black text-white font-sans text-[12px] font-semibold tracking-[0.15em] py-3 hover:bg-black/80 transition-colors duration-300"
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
