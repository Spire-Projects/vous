"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useInfluencers } from "@/hooks/useInfluencers";

export function IconTeaser() {
  const { influencers, loading } = useInfluencers();
  const preview = influencers.slice(0, 3);

  return (
    <section className="bg-black text-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
              VOUS ICON · Embajadores
            </span>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-5">
              Inspo Outfits de nuestra comunidad
            </h2>
            <p className="font-sans text-sm text-white/60 max-w-md leading-relaxed mb-8">
              Las voces y miradas que dan vida a cada colección. Descubre cómo los influencers visten VOUS.
            </p>
            <Link
              href="/icon"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-nav text-[11px] uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Conoce a los icon <ArrowRight size={14} />
            </Link>
          </div>

          <div className="md:col-span-7">
            {loading ? (
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : preview.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {preview.map((inf, i) => (
                  <div
                    key={inf.id}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 ${i === 1 ? "md:translate-y-6" : ""}`}
                  >
                    {inf.imageUrl || (inf.images && inf.images[0]) ? (
                      <img
                        src={inf.imageUrl ?? inf.images[0]}
                        alt={inf.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 font-serif text-5xl">
                        {inf.name[0]}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-serif text-sm text-white truncate">{inf.name}</p>
                    </div>
                    <Star size={14} className="absolute top-3 right-3 text-[#C9A84C]" strokeWidth={1.5} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-white/5 flex items-center justify-center">
                <Sparkles size={32} className="text-white/20" strokeWidth={1} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
