"use client";

import { Star, ExternalLink } from "lucide-react";

const INFLUENCERS = [
  {
    id: "danny-beltran",
    name: "Danny Beltran",
    imageUrl: "",
    instagramUrl: "https://www.instagram.com/danny.stylist_ba?igsh=eXhtcGtkczJiOGpi",
    tiktokUrl: "https://www.tiktok.com/@dani.stylebiz?_r=1&_t=ZS-96nb7RgOZVw",
    bio: "Stylist & Fashion Content Creator",
  },
  {
    id: "romer-angola",
    name: "Romer Angola",
    imageUrl: "",
    instagramUrl: "https://www.instagram.com/rom_angola?igsh=MW5vcmJxc3ZhMDM4eQ==",
    tiktokUrl: "https://www.tiktok.com/@rom_angola?_r=1&_t=ZS-96nc04SS6lj",
    bio: "Fashion & Lifestyle Influencer",
  },
  {
    id: "sasha-vasquez",
    name: "Sasha Vasquez",
    imageUrl: "",
    instagramUrl: "https://www.instagram.com/sashavasquez__?igsh=MW4wa3hxMXVvNjI0MA==",
    tiktokUrl: "https://www.tiktok.com/@sashavasquez__?_r=1&_t=ZS-96nbiu5EBxn",
    bio: "Moda Urbana & Streetwear",
  },
];

export function IconPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-black min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d2e15] via-[#2a2015] to-[#0d0d0b]" />
        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
          <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-white mb-4 block">
            Inspo Outfits
          </span>
          <h1 className="font-serif text-[36px] md:text-[56px] text-white leading-tight mb-4">
            VOUS ICON
          </h1>
          <p className="font-sans text-sm text-white/70 max-w-lg mx-auto">
            Descubre los outfits que nuestros influencers crean con VOUS. Síguelos para más inspiración de estilo y sé parte de la comunidad.
          </p>
        </div>
      </section>

      {/* Influencers Grid */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="mb-14 text-center">
            <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-3 block">
              Nuestros Embajadores
            </span>
            <h2 className="font-serif text-[28px] md:text-[42px] text-black">
              Influencers VOUS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INFLUENCERS.map((inf) => (
              <div
                key={inf.id}
                className="group bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-black/40 transition-all duration-300"
              >
                {/* Photo */}
                <div className="aspect-[3/4] bg-white relative overflow-hidden">
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
                        <span className="font-sans text-[10px] text-black/60 mt-1 block">
                          {inf.bio}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl text-black">{inf.name}</h3>
                    <p className="font-sans text-[12px] text-black/50 mt-1">{inf.bio}</p>
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-black">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 text-center">
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
