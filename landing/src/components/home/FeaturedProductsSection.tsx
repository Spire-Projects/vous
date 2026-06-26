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
      <section className="py-20 md:py-28 bg-white flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
            className={`py-12 md:py-20 ${isDark ? "bg-black" : "bg-white"}`}
          >
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-6 md:mb-10">
                <div>
                  <p
                    className={`font-nav text-[11px] font-semibold tracking-[0.2em] uppercase mb-2 ${isDark ? "text-white/40" : "text-black/40"}`}
                  >
                    {section.customType || SECTION_EYEBROW[section.type]}
                  </p>
                  <h2
                    className={`font-serif text-2xl md:text-3xl font-medium ${isDark ? "text-white" : "text-black"}`}
                  >
                    {section.name}
                  </h2>
                </div>
                <Link
                  href={VIEW_ALL_HREF[section.type]}
                  className={`hidden md:inline-flex font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-colors ${
                    isDark
                      ? "text-white border-white/30 hover:border-white"
                      : "text-black border-black/30 hover:border-black"
                  }`}
                >
                  Ver Todo
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {section.products.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    userRole={user?.role}
                    userUid={user?.uid}
                  />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href={VIEW_ALL_HREF[section.type]}
                  className={`font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-colors ${
                    isDark
                      ? "text-white border-white/30 hover:border-white"
                      : "text-black border-black/30 hover:border-black"
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
