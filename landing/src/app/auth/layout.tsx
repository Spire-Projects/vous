import type { ReactNode } from "react";
import Link from "next/link";
import { HeaderLogo } from "@/components/layout/Header/HeaderLogo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 sm:px-8 py-5 border-b border-white/40 bg-white/60 backdrop-blur-lg">
        <HeaderLogo />
      </header>

      <main className="flex-1 flex">{children}</main>

      <footer className="px-6 sm:px-8 py-5 border-t border-white/40 bg-white/60 backdrop-blur-lg">
        <div className="flex gap-6 text-[11px] font-nav font-semibold uppercase tracking-[0.18em] text-black/50">
          <Link href="/privacidad" className="hover:text-black transition-colors">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-black transition-colors">
            Términos
          </Link>
          <Link href="/ayuda" className="hover:text-black transition-colors">
            Ayuda
          </Link>
        </div>
      </footer>
    </div>
  );
}
