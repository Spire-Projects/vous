import { CatalogFilters } from "@/components/catalogo/CatalogFilters";
import { CatalogGrid } from "@/components/catalogo/CatalogGrid";

export default function CatalogoPage() {
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
          <CatalogFilters />
          <CatalogGrid />
        </div>
      </div>
    </div>
  );
}
