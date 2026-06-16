"use client";

import { Star, ExternalLink } from "lucide-react";
import { useInfluencers } from "@/hooks/useInfluencers";

export function IconPage() {
  const { influencers, loading, error } = useInfluencers();

  return (
    <>
      {/* Hero */}
      <section className="bg-black py-14 md:py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-white/40 mb-3 block">
              Inspo Outfits
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-4">
              VOUS ICON
            </h1>
            <p className="font-sans text-sm text-white/60 max-w-lg leading-relaxed">
              Descubre los outfits que nuestros influencers crean con VOUS. Síguelos para más inspiración de estilo y sé parte de la comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* Influencers Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-3 block">
              Nuestros Embajadores
            </span>
            <h2 className="font-serif text-[28px] md:text-[42px] text-black">
              Influencers VOUS
            </h2>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-black/50">No se pudieron cargar los influencers.</p>
            </div>
          )}

          {!loading && !error && influencers.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-black/50">Próximamente influencers.</p>
            </div>
          )}

          {!loading && !error && influencers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {influencers.map((inf) => (
                <div
                  key={inf.id}
                  className="group bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-black/40 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
                    {inf.imageUrl ? (
                      <img
                        src={inf.imageUrl}
                        alt={inf.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-black/10 flex items-center justify-center">
                          <span className="font-serif text-4xl text-black">{inf.name[0]}</span>
                        </div>
                        <div className="text-center">
                          <span className="font-nav text-[11px] uppercase tracking-[0.2em] text-black/50 block">
                            {inf.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif text-xl text-black">{inf.name}</h3>
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-black/10">
                      {inf.instagramUrl && (
                        <a
                          href={inf.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-black/50 hover:text-black text-[11px] font-sans transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                          <span className="font-nav text-[10px] uppercase tracking-wide">Instagram</span>
                          <ExternalLink size="10" />
                        </a>
                      )}
                      {inf.tiktokUrl && (
                        <a
                          href={inf.tiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-black/50 hover:text-black text-[11px] font-sans transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.87 2.87 0 0 1 1.14.23V9.16a6.34 6.34 0 0 0-1.14-.11A6.21 6.21 0 0 0 4.17 15.3a6.21 6.21 0 0 0 6.22 6.05 6.22 6.22 0 0 0 6.22-6.05V9.02a8.29 8.29 0 0 0 4.83 1.54V7.11a4.86 4.86 0 0 1-1.85-.42z" />
                          </svg>
                          <span className="font-nav text-[10px] uppercase tracking-wide">TikTok</span>
                          <ExternalLink size="10" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Star size={32} className="text-white mx-auto mb-4" />
          <h2 className="font-serif text-[28px] md:text-[36px] text-white mb-4">
            ¿Querés ser parte de VOUS ICON?
          </h2>
          <p className="font-sans text-sm text-white/70 max-w-lg mx-auto mb-8">
            Si sos creador de contenido y te apasiona la moda urbana, escribinos para colaborar con la marca.
          </p>
          <a
            href="mailto:icon@vous.com"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-nav text-[12px] uppercase tracking-wide hover:bg-white/80 transition-colors"
          >
            Colaborar con VOUS
          </a>
        </div>
      </section>
    </>
  );
}
