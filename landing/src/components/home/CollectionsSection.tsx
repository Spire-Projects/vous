"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { proxyCldUrl } from "@/utils/proxyCldUrl";

const PLACEHOLDER_BGS = [
  "from-[#d4cfc6] via-[#b8b0a4] to-[#8a8278]",
  "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]",
] as const;

export function CollectionsSection() {
  const { categories, loading } = useCategories();
  const displayed = categories.slice(0, 4);

  return (
    <section className="bg-vous-warm-white py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-bold text-vous-soft-black text-center mb-16 md:mb-24">
          EXPLORA{" "}
          <span className="font-serif text-4xl md:text-5xl font-medium italic text-vous-gold">
            CATEGORÍAS
          </span>
        </h2>

        {loading && (
          <div className="flex flex-col gap-20 md:gap-32">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="w-full md:w-7/12 aspect-[3/2] animate-pulse bg-vous-gray-light/40" />
              <div className="w-full md:w-3/12 space-y-4">
                <div className="h-3 w-20 bg-vous-gray-light/40" />
                <div className="h-8 w-40 bg-vous-gray-light/40" />
                <div className="h-16 w-full bg-vous-gray-light/40" />
              </div>
            </div>
          </div>
        )}

        {!loading && displayed.length > 0 && (
          <div className="flex flex-col gap-20 md:gap-32">
            {displayed.map((cat, index) => {
              const isReversed = index % 2 === 1;
              return (
                <div
                  key={cat.id}
                  className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16`}
                >
                  {/* Image */}
                  <div className="w-full md:w-7/12 relative overflow-hidden">
                    {cat.banner || cat.image ? (
                      <img
                        src={proxyCldUrl(cat.banner ?? cat.image ?? "")}
                        alt={cat.name}
                        className="w-full grayscale hover:grayscale-0 transition-all duration-1000 object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full aspect-[3/2] bg-gradient-to-br ${PLACEHOLDER_BGS[index % PLACEHOLDER_BGS.length]}`}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className={`w-full md:w-3/12 space-y-5 ${isReversed ? "md:text-right" : ""}`}>
                    <span className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-gray uppercase">
                      {String(index + 1).padStart(2, "0")} / {cat.name}
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black uppercase">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="font-sans text-sm text-vous-gray leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                    <Link
                      href={`/catalogo?categoria=${cat.slug}`}
                      className={`inline-block font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-vous-soft-black border-b border-vous-soft-black pb-1 hover:text-vous-gold hover:border-vous-gold transition-colors ${isReversed ? "md:ml-auto" : ""}`}
                    >
                      Explorar Colección
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
