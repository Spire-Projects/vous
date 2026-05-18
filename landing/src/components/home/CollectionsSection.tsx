"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

const PLACEHOLDER_BGS = [
  "from-[#d4cfc6] via-[#b8b0a4] to-[#8a8278]",
  "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]",
  "from-[#3d3d38] to-[#1a1a18]",
  "from-[#6b5a3a] to-[#3d2e15]",
];

export function CollectionsSection() {
  const { categories, loading } = useCategories();

  // Show at most 4 categories in this section
  const displayed = categories.slice(0, 4);

  return (
    <section className="bg-vous-soft-black py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="mb-12 md:mb-16">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-2">
            Temporada 2026
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-white">
            Nuestras Colecciones
          </h2>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-vous-gray-dark/60" />
            ))}
          </div>
        )}

        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {displayed.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-vous-gray-dark"
              >
                {cat.banner || cat.image ? (
                  <img
                    src={cat.banner ?? cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_BGS[index % PLACEHOLDER_BGS.length]} group-hover:scale-105 transition-transform duration-500`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="font-nav text-[11px] tracking-[0.2em] text-vous-gold uppercase mb-2">
                    {String(index + 1).padStart(2, "0")} / {cat.name}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{cat.name}</h3>
                  {cat.description && (
                    <p className="font-sans text-sm text-white/70 leading-relaxed mb-4 hidden md:block">
                      {cat.description}
                    </p>
                  )}
                  <span className="font-nav text-[12px] font-semibold tracking-[0.12em] uppercase text-vous-gold border-b border-vous-gold/50 pb-0.5 group-hover:border-vous-gold transition-colors">
                    Explorar Colección
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
