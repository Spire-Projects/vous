"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shirt } from "lucide-react";

export function AsesoriaTeaser() {
  return (
    <section className="bg-[#FAF8F5] py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="grid grid-cols-12 gap-3">
              <div className="relative col-span-7 aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900">
                <Image
                  src="/vous-about-2.png"
                  alt="Asesoría de Moda VOUS"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="col-span-5 space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0d0d0b]">
                  <Image
                    src="/vous-about.png"
                    alt="Estilo VOUS"
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
                  <Image
                    src="/vous-about-2.png"
                    alt="Editorial VOUS"
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
              Asesoría de Moda
            </span>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-5">
              Consejos de estilo curados
            </h2>
            <p className="font-sans text-sm text-black/60 max-w-md leading-relaxed mb-8">
              Tendencias, guías y tips editoriales para construir tu identidad. Encuentra lo que
              mejor te representa.
            </p>
            <Link
              href="/asesoria-de-moda"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-nav text-[11px] uppercase tracking-wider hover:bg-black/80 transition-colors"
            >
              Explorar asesoría <ArrowRight size={14} />
            </Link>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-black/10">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#C9A84C]" strokeWidth={1.5} />
                <span className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50">
                  Tendencias 2026
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shirt size={14} className="text-[#C9A84C]" strokeWidth={1.5} />
                <span className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50">
                  Editorial
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
