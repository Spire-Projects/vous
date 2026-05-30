"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { useAuthContext } from "@/context/AuthContext";
import { useLandingSections } from "@/hooks/useLandingSections";
import type { LandingSectionType } from "@/domain/entities/landing-section.entity";

const VIEW_ALL_HREF: Record<LandingSectionType, string> = {
  featured: "/catalogo?destacados=1",
  new_arrivals: "/catalogo?nuevas=1",
  discounted: "/catalogo?descuento=1",
  special_collection: "/catalogo?coleccion-especial=1",
  bestseller: "/catalogo?mas-vendidos=1",
};

const SECTION_EYEBROW: Record<LandingSectionType, string> = {
  featured: "Selección Editorial",
  new_arrivals: "Últimas Piezas",
  discounted: "Ofertas",
  special_collection: "Edición Limitada",
  bestseller: "Los Favoritos",
};

export function FeaturedProductsSection() {
  const { user } = useAuthContext();
  const { sections, loading } = useLandingSections();

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-vous-warm-white flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </section>
    );
  }

  if (!sections.length) return null;

  return (
    <>
      {sections.map((section, idx) => {
        const isDark = idx % 2 === 1;
        return (
          <section
            key={section.id}
            className={`py-20 md:py-28 ${isDark ? "bg-vous-soft-black" : "bg-vous-warm-white"}`}
          >
            <div className="max-w-[1440px] mx-auto px-5 md:px-20">
              <div className="flex items-end justify-between mb-10 md:mb-14">
                <div>
                  <p className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 text-vous-gold">
                    {section.customType || SECTION_EYEBROW[section.type]}
                  </p>
                  <h2
                    className={`font-serif text-4xl md:text-5xl font-medium ${isDark ? "text-white" : "text-vous-soft-black"}`}
                  >
                    {section.name}
                  </h2>
                </div>
                <Link
                  href={VIEW_ALL_HREF[section.type]}
                  className={`hidden md:inline-flex font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-colors ${
                    isDark
                      ? "text-vous-gold border-vous-gold/50 hover:border-vous-gold"
                      : "text-vous-soft-black border-vous-black/30 hover:border-vous-soft-black"
                  }`}
                >
                  Ver Todo
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                {section.products.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    userRole={user?.role}
                    userUid={user?.uid}
                  />
                ))}
              </div>

              <div className="mt-10 text-center md:hidden">
                <Link
                  href={VIEW_ALL_HREF[section.type]}
                  className={`font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-colors ${
                    isDark
                      ? "text-vous-gold border-vous-gold/50 hover:border-vous-gold"
                      : "text-vous-soft-black border-vous-black/30 hover:border-vous-soft-black"
                  }`}
                >
                  Ver Todo
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
