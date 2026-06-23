"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useStyleGuides } from "@/hooks/useStyleGuides";
import { useProducts } from "@/hooks/useProducts";
import { useAuthContext } from "@/context/AuthContext";
import { ProductCard } from "@/components/catalogo/ProductCard";
import {
  Sparkles,
  Palette,
  Ruler,
  Shirt,
  ChevronRight,
} from "lucide-react";
import type { StyleGuide } from "@/domain/entities/style-guide.entity";

function GuidePin({ guide }: { guide: StyleGuide }) {
  return (
    <Link
      href={`/recomendaciones?guia=${guide.id}`}
      className="group block break-inside-avoid mb-4"
    >
      <div className="rounded-xl overflow-hidden bg-neutral-100">
        {guide.imageUrl ? (
          <img
            src={guide.imageUrl}
            alt={guide.name}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
          />
        ) : guide.colorHex ? (
          <div className="w-full aspect-[3/4]" style={{ backgroundColor: guide.colorHex }} />
        ) : (
          <div className="w-full aspect-[3/4] bg-neutral-100 flex items-center justify-center">
            {guide.type === "skinTone" ? (
              <Palette size={32} className="text-black/10" strokeWidth={1} />
            ) : (
              <Shirt size={32} className="text-black/10" strokeWidth={1} />
            )}
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-serif text-sm md:text-base text-black group-hover:text-black/70 transition-colors">
          {guide.name}
        </h3>
        <p className="font-sans text-[11px] text-black/40 line-clamp-2 mt-0.5 leading-relaxed">
          {guide.description}
        </p>
        <span className="inline-flex items-center gap-1 mt-1 font-nav text-[10px] uppercase tracking-wider text-black/30 group-hover:text-black/60 transition-colors">
          {guide.type === "skinTone"
            ? `${guide.recommendedColors.length} colores`
            : `${guide.recommendedAttributes.length} cortes`}{" "}
          <ChevronRight size={10} />
        </span>
      </div>
    </Link>
  );
}

export default function AsesoriaPage() {
  const { config, loading: configLoading } = useSiteConfig();
  const { guides, loading: guidesLoading } = useStyleGuides();
  const { products, loading: productsLoading } = useProducts();
  const { user } = useAuthContext();

  const [selectedSkin, setSelectedSkin] = useState<StyleGuide | null>(null);
  const [selectedBody, setSelectedBody] = useState<StyleGuide | null>(null);

  const section = config?.fashionTrends;

  const skinGuides = useMemo(
    () => guides.filter((g) => g.type === "skinTone" && g.active),
    [guides]
  );
  const bodyGuides = useMemo(
    () => guides.filter((g) => g.type === "bodyType" && g.active),
    [guides]
  );
  const allActiveGuides = useMemo(
    () => guides.filter((g) => g.active),
    [guides]
  );

  const matchedProducts = useMemo(() => {
    if (!selectedSkin && !selectedBody) return [];
    return products.filter((p) => {
      let skinMatch = true;
      let bodyMatch = true;
      if (selectedSkin) {
        const productColors = p.colors.map((c) => c.name);
        skinMatch = selectedSkin.recommendedColors.some((rc) =>
          productColors.some(
            (pc) =>
              pc.toLowerCase().includes(rc.toLowerCase()) ||
              rc.toLowerCase().includes(pc.toLowerCase())
          )
        );
      }
      if (selectedBody) {
        const attrValues = Object.values(p.attributes);
        bodyMatch = selectedBody.recommendedAttributes.some((ra) =>
          attrValues.some(
            (av) =>
              av.toLowerCase().includes(ra.toLowerCase()) ||
              ra.toLowerCase().includes(av.toLowerCase())
          )
        );
      }
      return skinMatch && bodyMatch;
    });
  }, [selectedSkin, selectedBody, products]);

  if (configLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-black py-14 md:py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-white/40 mb-3 block">
            Asesoría de Moda
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-4">
            {section?.title || "Asesoría de Moda"}
          </h1>
          <p className="font-sans text-sm text-white/60 max-w-lg leading-relaxed">
            {section?.subtitle ||
              "Descubre los mejores consejos de estilo seleccionados por nuestro equipo."}
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-20">
        {/* Intro content */}
        {section?.content && (
          <div className="max-w-3xl mb-16">
            <div
              className="font-sans text-black/50 leading-relaxed [&_strong]:font-semibold [&_strong]:text-black [&_em]:italic [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-black [&_h2]:mt-6 [&_h2]:mb-3"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        )}

        {/* Main image if exists - shown naturally without zoom/crop */}
        {(section?.imageUrl || (section?.images && section.images.length > 0)) && (
          <div className="mb-16">
            {section.images && section.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {section.images.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-neutral-100">
                    <img src={img} alt={`Asesoría ${i + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-neutral-100">
                <img
                  src={section.imageUrl}
                  alt={section.title || "Asesoría"}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        )}

        {/* Pinterest-style guide grid */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-nav text-[11px] tracking-[0.25em] text-black uppercase mb-2">
                Inspiración
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-black">
                Descubrí tu estilo
              </h2>
            </div>
          </div>

          {guidesLoading ? (
            <div className="flex justify-center py-12">
              <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            </div>
          ) : allActiveGuides.length === 0 ? (
            <p className="text-center font-sans text-sm text-black/40 py-8">
              No hay guías disponibles.
            </p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {allActiveGuides.map((guide) => (
                <GuidePin key={guide.id} guide={guide} />
              ))}
            </div>
          )}
        </div>

        {/* Match section */}
        <div className="bg-[#FAF8F5] rounded-2xl p-6 md:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black mb-4">
              <Sparkles size={18} className="text-white" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-black mb-3">
              Encontrá tu match
            </h2>
            <p className="font-sans text-sm text-black/50 leading-relaxed">
              Seleccioná tu tono de piel y tipo de cuerpo para descubrir prendas
              que te favorecen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
            {/* Skin tone selector */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette size={16} className="text-black" />
                <h3 className="font-nav text-[11px] tracking-[0.2em] uppercase text-black">
                  Tono de piel
                </h3>
              </div>
              {skinGuides.length === 0 ? (
                <p className="text-sm text-black/40 font-sans">
                  No hay guías de tono de piel.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skinGuides.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() =>
                        setSelectedSkin((prev) =>
                          prev?.id === guide.id ? null : guide
                        )
                      }
                      className={`px-4 py-2 rounded-lg border text-[11px] font-nav tracking-wider uppercase transition-all ${
                        selectedSkin?.id === guide.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black/60 border-black/10 hover:border-black/30"
                      }`}
                    >
                      {guide.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Body type selector */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ruler size={16} className="text-black" />
                <h3 className="font-nav text-[11px] tracking-[0.2em] uppercase text-black">
                  Tipo de cuerpo
                </h3>
              </div>
              {bodyGuides.length === 0 ? (
                <p className="text-sm text-black/40 font-sans">
                  No hay guías de tipo de cuerpo.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bodyGuides.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() =>
                        setSelectedBody((prev) =>
                          prev?.id === guide.id ? null : guide
                        )
                      }
                      className={`px-4 py-2 rounded-lg border text-[11px] font-nav tracking-wider uppercase transition-all ${
                        selectedBody?.id === guide.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black/60 border-black/10 hover:border-black/30"
                      }`}
                    >
                      {guide.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Matched products */}
          {(selectedSkin || selectedBody) && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-black">
                  Productos recomendados
                </h3>
                <span className="font-nav text-[10px] tracking-wider uppercase text-black/40">
                  {matchedProducts.length} resultados
                </span>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                </div>
              ) : matchedProducts.length === 0 ? (
                <p className="text-center font-sans text-sm text-black/40 py-8">
                  No hay productos que coincidan con tu selección. Probá con otra
                  combinación.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {matchedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      {...p}
                      userRole={user?.role}
                      userUid={user?.uid}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
