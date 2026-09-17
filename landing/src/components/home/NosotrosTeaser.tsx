"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function NosotrosTeaser() {
  const { config } = useSiteConfig();
  const storeName = config?.storeName ?? "VOUS";

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
              Nosotros
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-black leading-[1.05] mb-5">
              Redefiniendo el Lujo Urbano
            </h2>
            <p className="font-sans text-sm text-black/60 max-w-md leading-relaxed mb-8">
              {storeName} no es solo una marca; es un manifiesto de estilo de vida para quienes
              encuentran la belleza en la simplicidad arquitectónica y la sofisticación de la calle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-nav text-[11px] uppercase tracking-wider hover:bg-black/80 transition-colors"
              >
                Conoce nuestra historia <ArrowRight size={14} />
              </Link>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 border border-black/15 text-black px-6 py-3 rounded-xl font-nav text-[11px] uppercase tracking-wider hover:bg-black/5 transition-colors"
              >
                Ir al catálogo
              </Link>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900">
                <Image
                  src="/vous-about-2.png"
                  alt="VOUS - Tú nos inspiras"
                  fill
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 mt-8">
                <Image
                  src="/vous-about.png"
                  alt="Misión, Visión y Valores VOUS"
                  fill
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0d0d0b] -mt-4">
                <Image
                  src="/vous-about-2.png"
                  alt="Estilo VOUS"
                  fill
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 mt-4">
                <Image
                  src="/vous-about.png"
                  alt="Comunidad VOUS"
                  fill
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="object-cover object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
