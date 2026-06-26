"use client";

import Link from "next/link";
import { ArrowRight, Palette, Ruler } from "lucide-react";
import { useStyleGuides } from "@/hooks/useStyleGuides";

export function RecomendacionesTeaser() {
  const { guides, loading } = useStyleGuides();
  const skinGuides = guides.filter((g) => g.type === "skinTone" && g.active).slice(0, 3);
  const bodyGuides = guides.filter((g) => g.type === "bodyType" && g.active).slice(0, 3);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
            Colorimetría · Tipología
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-black leading-[1.05] mb-5">
            Recomendaciones para vos
          </h2>
          <p className="font-sans text-sm text-black/50 leading-relaxed">
            Descubre qué colores y cortes te favorecen según tu tono de piel y tipo de cuerpo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link href="/recomendaciones" className="group block">
            <div className="bg-[#FAF8F5] rounded-2xl p-6 md:p-8 h-full hover:bg-[#F0EBE3] transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <Palette size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-black">Colores para tu piel</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {loading ? (
                  <span className="font-sans text-xs text-black/40">Cargando...</span>
                ) : skinGuides.length > 0 ? (
                  skinGuides.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-white border border-black/10 rounded-lg font-sans text-xs text-black">
                      {g.name}
                    </span>
                  ))
                ) : (
                  <span className="font-sans text-xs text-black/40">Próximamente</span>
                )}
              </div>
              <span className="inline-flex items-center gap-1 font-nav text-[10px] uppercase tracking-wider text-black/60 group-hover:text-black">
                Explorar por color <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          <Link href="/recomendaciones" className="group block">
            <div className="bg-[#FAF8F5] rounded-2xl p-6 md:p-8 h-full hover:bg-[#F0EBE3] transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <Ruler size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-black">Cortes para tu cuerpo</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {loading ? (
                  <span className="font-sans text-xs text-black/40">Cargando...</span>
                ) : bodyGuides.length > 0 ? (
                  bodyGuides.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-white border border-black/10 rounded-lg font-sans text-xs text-black">
                      {g.name}
                    </span>
                  ))
                ) : (
                  <span className="font-sans text-xs text-black/40">Próximamente</span>
                )}
              </div>
              <span className="inline-flex items-center gap-1 font-nav text-[10px] uppercase tracking-wider text-black/60 group-hover:text-black">
                Explorar por tipo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/recomendaciones"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-nav text-[11px] uppercase tracking-wider hover:bg-black/80 transition-colors"
          >
            Ver todas las recomendaciones <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
