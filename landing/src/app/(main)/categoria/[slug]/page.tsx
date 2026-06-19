"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useCategoryBySlug } from "@/hooks/useCategoryBySlug";
import { useProductsByCategory } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { CatalogFilters } from "@/components/catalogo/CatalogFilters";
import { CatalogGrid } from "@/components/catalogo/CatalogGrid";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import { Suspense } from "react";

function CategoryPageContent() {
  const params = useParams();
  const slugRaw = params.slug;
  const slug = Array.isArray(slugRaw) ? slugRaw[0] ?? "" : slugRaw ?? "";

  const { category, loading: catLoading, error: catError } = useCategoryBySlug(slug);
  const { products, loading: prodLoading, error: prodError } = useProductsByCategory(category?.id ?? "");
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

  const loading = catLoading || prodLoading;
  const error = catError || prodError;

  if (catError && !catLoading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4 px-5">
        <p className="font-sans text-sm text-black/50">{catError}</p>
        <Link
          href="/categorias"
          className="font-nav text-[11px] uppercase tracking-wider text-black hover:underline"
        >
          Ver todas las categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative bg-black">
        <div className="absolute inset-0 overflow-hidden">
          {category?.banner || category?.image ? (
            <img
              src={proxyCldUrl(category.banner ?? category.image ?? "")}
              alt={category?.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#1a1a18] to-[#3d2e15]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Ruta de navegación"
            className="mb-6"
          >
            <ol className="flex items-center flex-wrap gap-1.5 font-nav text-[10px] tracking-[0.15em] uppercase text-white/50">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <ChevronRight size={10} className="text-white/30" />
              </li>
              <li>
                <Link href="/categorias" className="hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <ChevronRight size={10} className="text-white/30" />
              </li>
              <li className="text-white/80 truncate max-w-[200px]">
                {category?.name ?? "Cargando…"}
              </li>
            </ol>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-[#C9A84C] uppercase mb-3">
              Colección
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-medium text-white mb-4">
              {category?.name ?? "Categoría"}
            </h1>
            {category?.description && (
              <p className="font-sans text-sm text-white/70 max-w-xl leading-relaxed">
                {category.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Sub-navigation: other categories */}
      {!catLoading && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-b border-black/10"
        >
          <div className="max-w-[1440px] mx-auto px-5 md:px-20">
            <div className="flex items-center gap-6 overflow-x-auto py-4 no-scrollbar">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className={`shrink-0 font-nav text-[11px] tracking-[0.15em] uppercase transition-colors pb-1 border-b-2 ${
                    cat.id === category?.id
                      ? "text-black border-black"
                      : "text-black/40 border-transparent hover:text-black hover:border-black/20"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}

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
            hideCategoryFilter
          />
          <CatalogGrid products={filtered} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default function CategoriaPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen flex items-center justify-center">
          <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        </div>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
