"use client";

import Link from "next/link";
import { Star, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { useInfluencers } from "@/hooks/useInfluencers";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { Button } from "@/components/ui/button";

export function IconPage() {
  const { influencers, loading, error } = useInfluencers();

  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C9A84C]/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                Embajadores VOUS · Inspo Outfits
              </span>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
                VOUS ICON
              </h1>
              <p className="font-sans text-base text-white/60 max-w-xl leading-relaxed">
                Las voces y miradas que dan vida a cada colección. Descubre los outfits que
                nuestros influencers crean con VOUS y sé parte de la comunidad.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <div className="inline-flex items-center gap-3 border border-white/15 rounded-full px-5 py-2.5">
                <Sparkles size={14} className="text-[#C9A84C]" strokeWidth={1.5} />
                <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-white/70">
                  Comunidad VOUS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Influencers Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-nav text-[11px] tracking-[0.25em] uppercase text-[#C9A84C] mb-3">
                Nuestros Embajadores
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-black">
                Influencers VOUS
              </h2>
            </div>
            <p className="font-sans text-sm text-black/50 max-w-md">
              Síguelos en sus redes para más inspiración de estilo.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="font-sans text-sm text-black/50">No se pudieron cargar los influencers.</p>
            </div>
          )}

          {!loading && !error && influencers.length === 0 && (
            <div className="text-center py-20">
              <p className="font-sans text-sm text-black/50">Próximamente influencers.</p>
            </div>
          )}

          {!loading && !error && influencers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((inf) => (
                <div
                  key={inf.id}
                  className="group bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-black/30 transition-all duration-500"
                >
                  <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
                    {inf.images && inf.images.length > 0 ? (
                      <ImageCarousel
                        images={inf.images}
                        alt={inf.name}
                        aspect="auto"
                        interval={1800}
                        showDots={false}
                        pauseOnHover
                        className="w-full h-full"
                      />
                    ) : inf.imageUrl ? (
                      <img
                        src={inf.imageUrl}
                        alt={inf.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center">
                          <span className="font-serif text-4xl text-black">{inf.name[0]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-serif text-xl text-black">{inf.name}</h3>
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

      {/* Editorial CTA to catalog */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                Viste como ellos
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-5">
                Descubre las prendas que usan los VOUS ICON
              </h2>
              <p className="font-sans text-base text-white/60 max-w-md leading-relaxed mb-8">
                Explora el catálogo completo y encuentra las piezas que se ajustan a tu estilo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-white text-black hover:bg-white/90 font-nav text-[11px] uppercase tracking-wider">
                  <Link href="/catalogo">
                    Ir al catálogo <ArrowRight size={14} className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline-white" className="font-nav text-[11px] uppercase tracking-wider">
                  <Link href="/asesoria-de-moda">
                    Asesoría de moda
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#3d3d38] to-[#0d0d0b]" />
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#6b5a3a] to-[#1a1208] mt-8" />
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#1a1a18] to-[#3d3d38] -mt-4" />
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#d4cfc6] to-[#8a8278] mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Collaborate CTA */}
      <section className="bg-[#FAF8F5] py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <Star size={28} className="text-[#C9A84C] mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="font-serif text-3xl md:text-4xl text-black mb-4">
            ¿Querés ser parte de VOUS ICON?
          </h2>
          <p className="font-sans text-sm text-black/50 max-w-lg mx-auto leading-relaxed mb-8">
            Si sos creador de contenido y te apasiona la moda urbana, escribinos para colaborar con la marca.
          </p>
          <a
            href="mailto:icon@vous.com"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-nav text-[11px] uppercase tracking-wide hover:bg-black/80 transition-colors"
          >
            Colaborar con VOUS <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}
