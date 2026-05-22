"use client";

import { CatalogFilters } from "@/components/catalogo/CatalogFilters";
import { CatalogGrid } from "@/components/catalogo/CatalogGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { Suspense } from "react";

function CatalogoContent() {
  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  const {
    state,
    filtered,
    filters,
    activeCount,
    setQuery,
    setCategory,
    toggleSize,
    toggleColor,
    toggleMaterial,
    setPriceRange,
    toggleTag,
    clearFilters,
  } = useCatalogFilters(products, categories);

  return (
    <div className="bg-vous-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-vous-soft-black py-14 md:py-20 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-3">
            Temporada 2026
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
            Compra la Colección
          </h1>
          <p className="font-sans text-sm text-white/60 max-w-xl leading-relaxed">
            Esenciales seleccionados para el habitante urbano moderno, donde la precisión
            arquitectónica se une con el lujo sin esfuerzo.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <CatalogFilters
            filters={filters}
            state={state}
            activeCount={activeCount}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
            onToggleSize={toggleSize}
            onToggleColor={toggleColor}
            onToggleMaterial={toggleMaterial}
            onPriceChange={setPriceRange}
            onToggleTag={toggleTag}
            onClear={clearFilters}
          />
          <CatalogGrid products={filtered} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-vous-warm-white min-h-screen flex items-center justify-center">
          <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
