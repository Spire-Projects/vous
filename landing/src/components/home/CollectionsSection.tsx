"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { proxyCldUrl } from "@/utils/proxyCldUrl";

const PLACEHOLDER_BGS = [
  "from-[#d4cfc6] via-[#b8b0a4] to-[#8a8278]",
  "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]",
  "from-[#3d3d38] to-[#1a1a18]",
  "from-[#6b5a3a] to-[#3d2e15]",
];

export function CollectionsSection() {
  const { categories, loading } = useCategories();

  // Show at most 3 categories in this section (3 per row on desktop)
  const displayed = categories.slice(0, 3);

  return (
    <section className="bg-black py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-white/40 uppercase mb-2">
            Temporada 2026
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-white">
            Nuestras Colecciones
          </h2>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-white/10" />
            ))}
          </div>
        )}

        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {displayed.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900"
              >
                {cat.banner || cat.image ? (
                  <img
                    src={proxyCldUrl(cat.banner ?? cat.image ?? "")}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_BGS[index % PLACEHOLDER_BGS.length]} group-hover:scale-105 transition-transform duration-700`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p className="font-nav text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1.5">
                    {String(index + 1).padStart(2, "0")} / {cat.name}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl text-white mb-2">{cat.name}</h3>
                  {cat.description && (
                    <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed mb-3 hidden md:block line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <span className="font-nav text-[10px] font-semibold tracking-[0.12em] uppercase text-white border-b border-white/30 pb-0.5 group-hover:border-white transition-colors">
                    Explorar
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
