"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { proxyCldUrl } from "@/utils/proxyCldUrl";

const PLACEHOLDER_BGS = [
  "from-[#1a1a18] to-[#2a2015]",
  "from-[#3d3d38] to-[#1a1a18]",
  "from-[#d4cfc6] to-[#b0a898]",
  "from-[#2a2015] to-[#1a1a18]",
  "from-[#6b5a3a] to-[#3d2e15]",
  "from-[#b8b0a4] to-[#8a8278]",
  "from-[#4a3f2f] to-[#1a1a18]",
  "from-[#8a8278] to-[#6b6358]",
  "from-[#c9b99a] to-[#a89878]",
  "from-[#2d2518] to-[#0d0d0b]",
];

function getBg(index: number): string {
  return PLACEHOLDER_BGS[index % PLACEHOLDER_BGS.length];
}

export default function CategoriasPage() {
  const { categories, loading, error } = useCategories();

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="bg-vous-soft-black py-14 md:py-20 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-3">
            Explorar
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-white">Categorías</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-14 md:py-20">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-vous-gray-light/30 mb-4" />
                <div className="h-4 bg-vous-gray-light/30 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="font-sans text-vous-gray">{error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-vous-soft-black">No hay categorías aún</p>
            <p className="font-sans text-vous-gray mt-2">
              Vuelve pronto para descubrir nuevas colecciones.
            </p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {categories.map(({ id, slug, name, image, banner }, index) => (
              <Link key={id} href={`/catalogo?categoria=${slug}`} className="group block">
                <div
                  className={`relative aspect-square overflow-hidden mb-4 ${
                    !(image || banner) ? `bg-gradient-to-b ${getBg(index)}` : "bg-vous-soft-black"
                  }`}
                >
                  {(image || banner) && (
                    <img
                      src={proxyCldUrl(image ?? banner ?? "")}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-serif text-xl md:text-2xl text-white leading-tight">
                      {name}
                    </h2>
                    <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gold mt-1">
                      Ver productos
                    </p>
                  </div>
                </div>
                <span className="font-nav text-[11px] tracking-[0.12em] uppercase text-vous-gray group-hover:text-vous-gold transition-colors border-b border-vous-gray-light/40 pb-0.5">
                  Explorar {name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
