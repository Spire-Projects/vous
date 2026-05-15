import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-vous-warm-white flex flex-col">
      {/* Minimal nav bar */}
      <header className="px-8 py-6 border-b border-vous-gray-light/40">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-[0.12em] text-vous-soft-black hover:text-vous-gold transition-colors"
        >
          VOUS
        </Link>
      </header>

      <main className="flex-1 flex">{children}</main>

      {/* Minimal footer */}
      <footer className="px-8 py-5 border-t border-vous-gray-light/40">
        <div className="flex gap-6 text-[11px] font-nav font-semibold uppercase tracking-[0.18em] text-vous-gray">
          <Link href="/privacidad" className="hover:text-vous-gold transition-colors">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-vous-gold transition-colors">
            Términos
          </Link>
          <Link href="/ayuda" className="hover:text-vous-gold transition-colors">
            Ayuda
          </Link>
        </div>
      </footer>
    </div>
  );
}
