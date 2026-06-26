"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStyleGuides } from "@/hooks/useStyleGuides";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Shirt, ArrowLeft, ChevronRight, Palette, Ruler, ArrowRight,
} from "lucide-react";
import type { StyleGuide } from "@/domain/entities/style-guide.entity";

type ViewMode = "menu" | "skinTones" | "bodyTypes" | "guideDetail";

export default function RecomendacionesPage() {
  const { guides, loading: guidesLoading } = useStyleGuides();
  const { products, loading: productsLoading } = useProducts();
  const [view, setView] = useState<ViewMode>("menu");
  const [selectedGuide, setSelectedGuide] = useState<StyleGuide | null>(null);
  const [genderFilter, setGenderFilter] = useState<"all" | "men" | "women" | "unisex">("all");

  const skinGuides = guides.filter((g) => g.type === "skinTone");
  const bodyGuides = guides.filter((g) => g.type === "bodyType");

  const filteredSkinGuides = useMemo(() => {
    if (genderFilter === "all") return skinGuides;
    return skinGuides.filter((g) => g.gender === genderFilter || g.gender === "unisex");
  }, [skinGuides, genderFilter]);

  const filteredBodyGuides = useMemo(() => {
    if (genderFilter === "all") return bodyGuides;
    return bodyGuides.filter((g) => g.gender === genderFilter || g.gender === "unisex");
  }, [bodyGuides, genderFilter]);

  const recommendedProducts = useMemo(() => {
    if (!selectedGuide) return [];
    return products.filter((p) => {
      if (selectedGuide.type === "skinTone") {
        const productColors = p.colors.map((c) => c.name);
        return selectedGuide.recommendedColors.some((rc) =>
          productColors.some((pc) => pc.toLowerCase().includes(rc.toLowerCase()) || rc.toLowerCase().includes(pc.toLowerCase()))
        );
      }
      const attrValues = Object.values(p.attributes);
      return selectedGuide.recommendedAttributes.some((ra) =>
        attrValues.some((av) => av.toLowerCase().includes(ra.toLowerCase()) || ra.toLowerCase().includes(av.toLowerCase()))
      );
    });
  }, [selectedGuide, products]);

  function openGuide(guide: StyleGuide) {
    setSelectedGuide(guide);
    setView("guideDetail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-96 h-96 rounded-full bg-[#C9A84C]/20 blur-3xl" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                Colorimetría · Tipología
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6"
              >
                Recomendaciones
              </motion.h1>
              <p className="font-sans text-base text-white/60 max-w-xl leading-relaxed">
                Descubre qué colores y cortes te favorecen según tu tono de piel y tipo de cuerpo.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/15 rounded-xl p-4 bg-white/[0.02]">
                  <Palette size={18} className="text-[#C9A84C] mb-2" strokeWidth={1.5} />
                  <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-white/50">
                    Color
                  </p>
                </div>
                <div className="border border-white/15 rounded-xl p-4 bg-white/[0.02]">
                  <Ruler size={18} className="text-[#C9A84C] mb-2" strokeWidth={1.5} />
                  <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-white/50">
                    Corte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <AnimatePresence mode="wait">
          {view === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="flex justify-center">
                <div className="inline-flex bg-[#FAF8F5] border border-black/5 rounded-xl p-1">
                  {(["all", "women", "men"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={`px-4 py-2 font-nav text-[11px] uppercase tracking-wider rounded-lg transition-colors ${
                        genderFilter === g
                          ? "bg-black text-white"
                          : "text-black/50 hover:text-black"
                      }`}
                    >
                      {g === "all" ? "Todos" : g === "women" ? "Mujer" : "Hombre"}
                    </button>
                  ))}
                </div>
              </div>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <Palette size={18} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-black">Colores para tu piel</h2>
                    <p className="font-sans text-sm text-black/40">Selecciona tu tono de piel y descubre los colores que te favorecen.</p>
                  </div>
                  <button
                    onClick={() => setView("skinTones")}
                    className="ml-auto inline-flex items-center gap-1 font-nav text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors"
                  >
                    Ver todos <ChevronRight size={14} />
                  </button>
                </div>

                {guidesLoading ? (
                  <div className="flex justify-center py-12">
                    <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  </div>
                ) : filteredSkinGuides.length === 0 ? (
                  <p className="text-center font-sans text-sm text-black/40 py-8">No hay guías disponibles.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredSkinGuides.slice(0, 5).map((guide) => (
                      <SkinToneCard key={guide.id} guide={guide} onClick={() => openGuide(guide)} />
                    ))}
                  </div>
                )}
              </section>

              {filteredBodyGuides.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                      <Ruler size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl md:text-3xl text-black">Cortes para tu cuerpo</h2>
                      <p className="font-sans text-sm text-black/40">Encuentra los cortes y estilos que mejor se adaptan a tu tipo de cuerpo.</p>
                    </div>
                    <button
                      onClick={() => setView("bodyTypes")}
                      className="ml-auto inline-flex items-center gap-1 font-nav text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors"
                    >
                      Ver todos <ChevronRight size={14} />
                    </button>
                  </div>

                  {guidesLoading ? (
                    <div className="flex justify-center py-12">
                      <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredBodyGuides.slice(0, 4).map((guide) => (
                        <BodyTypeCard key={guide.id} guide={guide} onClick={() => openGuide(guide)} />
                      ))}
                    </div>
                  )}
                </section>
              )}
            </motion.div>
          )}

          {view === "skinTones" && (
            <motion.div
              key="skinTones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setView("menu")}
                className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors mb-8"
              >
                <ArrowLeft size={12} /> Volver
              </button>
              <h2 className="font-serif text-2xl md:text-3xl text-black mb-8">Colores para tu piel</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredSkinGuides.map((guide) => (
                  <SkinToneCard key={guide.id} guide={guide} onClick={() => openGuide(guide)} />
                ))}
              </div>
            </motion.div>
          )}

          {view === "bodyTypes" && (
            <motion.div
              key="bodyTypes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setView("menu")}
                className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors mb-8"
              >
                <ArrowLeft size={12} /> Volver
              </button>
              <h2 className="font-serif text-2xl md:text-3xl text-black mb-8">Cortes para tu cuerpo</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBodyGuides.map((guide) => (
                  <BodyTypeCard key={guide.id} guide={guide} onClick={() => openGuide(guide)} />
                ))}
              </div>
            </motion.div>
          )}

          {view === "guideDetail" && selectedGuide && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <button
                onClick={() => setView(selectedGuide.type === "skinTone" ? "skinTones" : "bodyTypes")}
                className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors"
              >
                <ArrowLeft size={12} /> Volver
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative">
                  {selectedGuide.imageUrl ? (
                    <img
                      src={selectedGuide.imageUrl}
                      alt={selectedGuide.name}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedGuide.colorHex ? (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: selectedGuide.colorHex }}>
                      <span className="font-serif text-4xl text-white/80">{selectedGuide.name[0]}</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                      <Sparkles size={48} className="text-black/10" strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-3 block">
                    {selectedGuide.type === "skinTone" ? "Colorimetría" : "Tipología"}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-black leading-tight mb-4">
                    {selectedGuide.name}
                  </h2>
                  <p className="font-sans text-sm text-black/50 leading-relaxed mb-8">
                    {selectedGuide.description}
                  </p>

                  {selectedGuide.type === "skinTone" && selectedGuide.recommendedColors.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/40 mb-3">
                        Colores que te favorecen
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.recommendedColors.map((color) => (
                          <span
                            key={color}
                            className="px-3 py-1.5 bg-[#FAF8F5] border border-black/10 font-sans text-xs text-black rounded-lg"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGuide.type === "bodyType" && selectedGuide.recommendedAttributes.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/40 mb-3">
                        Cortes recomendados
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.recommendedAttributes.map((attr) => (
                          <span
                            key={attr}
                            className="px-3 py-1.5 bg-[#FAF8F5] border border-black/10 font-sans text-xs text-black rounded-lg"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/catalogo${selectedGuide.type === "skinTone"
                      ? `?color=${selectedGuide.recommendedColors.map((c) => encodeURIComponent(c)).join("&color=")}`
                      : ""
                    }`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-nav text-[11px] uppercase tracking-wider rounded-lg hover:bg-black/80 transition-colors"
                  >
                    Ver productos recomendados <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-black mb-6">
                  Productos recomendados
                </h3>
                {productsLoading ? (
                  <div className="flex justify-center py-12">
                    <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  </div>
                ) : recommendedProducts.length === 0 ? (
                  <p className="font-sans text-sm text-black/40 text-center py-12">
                    No hay productos que coincidan con esta guía por el momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedProducts.map((p) => (
                      <ProductCard key={p.id} {...p} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editorial CTA */}
      <section className="bg-black text-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                ¿Listo para encontrar tu match?
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-5">
                Explorá el catálogo completo
              </h2>
              <p className="font-sans text-base text-white/60 max-w-md leading-relaxed">
                Filtros por color, tipo de cuerpo, talla y más.
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3">
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
        </div>
      </section>
    </div>
  );
}

function SkinToneCard({ guide, onClick }: { guide: StyleGuide; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group text-left w-full">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-3">
        {guide.imageUrl ? (
          <img
            src={guide.imageUrl}
            alt={guide.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : guide.colorHex ? (
          <div className="w-full h-full" style={{ backgroundColor: guide.colorHex }} />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <Sparkles size={32} className="text-black/10" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1 text-white font-nav text-[10px] uppercase tracking-wider">
            Ver guía <ChevronRight size={12} />
          </span>
        </div>
      </div>
      <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors">
        {guide.name}
      </h3>
      <p className="font-sans text-xs text-black/40 line-clamp-1 mt-0.5">
        {guide.recommendedColors.length} colores recomendados
      </p>
    </button>
  );
}

function BodyTypeCard({ guide, onClick }: { guide: StyleGuide; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group text-left w-full">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-3">
        {guide.imageUrl ? (
          <img
            src={guide.imageUrl}
            alt={guide.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <Shirt size={32} className="text-black/10" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1 text-white font-nav text-[10px] uppercase tracking-wider">
            Ver guía <ChevronRight size={12} />
          </span>
        </div>
      </div>
      <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors">
        {guide.name}
      </h3>
      <p className="font-sans text-xs text-black/40 line-clamp-1 mt-0.5">
        {guide.recommendedAttributes.length} cortes recomendados
      </p>
    </button>
  );
}
