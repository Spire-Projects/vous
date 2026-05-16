import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-vous-soft-black min-h-[92vh] flex flex-col md:flex-row overflow-hidden">
      {/* Left — text content */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-0 md:w-1/2 z-10">
        <span className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase border border-vous-gold/40 px-4 py-1.5 self-start mb-8">
          ESTILO | AUTENTICIDAD | EXCLUSIVIDAD
        </span>

        <h1 className="font-serif text-[clamp(3rem,6vw,5.5rem)] font-bold text-white leading-[1.0] tracking-[-0.02em] mb-6">
          TÚ NOS
          <br />
          INSPIRAS
        </h1>

        <p className="font-sans text-base text-white/70 max-w-sm mb-10 leading-relaxed">
          La perfección nunca nos inspiró. Nos inspira lo real. VOUS nace para quienes rompen moldes
          y crean su propia esencia.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="gold" size="default" asChild>
            <Link href="/catalogo">VER TODO</Link>
          </Button>
          <Button variant="outline-white" size="default" asChild>
            <Link href="/catalogo">EXPLORAR</Link>
          </Button>
        </div>
      </div>

      {/* Right — image placeholder */}
      <div className="relative md:w-1/2 min-h-[50vw] md:min-h-0">
        {/* Replace with CldImage when Cloudinary photo is available */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d2e15] via-[#2a2015] to-[#0d0d0b]" />
        <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/60 via-transparent to-transparent" />
        {/* Decorative grain */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
    </section>
  );
}
