"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { DynamicFilters, CatalogFilterState } from "@/hooks/useCatalogFilters";

interface CatalogFiltersProps {
  filters: DynamicFilters;
  state: CatalogFilterState;
  activeCount: number;
  loading?: boolean;
  onQueryChange: (q: string) => void;
  onCategoryChange: (id: string | null) => void;
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onToggleMaterial: (mat: string) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
  onToggleTag: (tag: string) => void;
  onClear: () => void;
  hideCategoryFilter?: boolean;
}

/* ── Color map for known colors ── */
const COLOR_SWATCHES: Record<string, string> = {
  Negro: "#1a1a1a",
  Blanco: "#f5f5f5",
  Rojo: "#dc2626",
  Azul: "#2563eb",
  Verde: "#16a34a",
  Amarillo: "#eab308",
  Rosa: "#ec4899",
  Gris: "#9ca3af",
  Beige: "#d4c4a8",
  Crema: "#fffdd0",
  Marron: "#92400e",
  Cafe: "#78350f",
  Naranja: "#f97316",
  Morado: "#9333ea",
  Violeta: "#8b5cf6",
  Dorado: "#c9a84c",
  Plateado: "#c0c0c0",
};

export function CatalogFilters({
  filters,
  state,
  activeCount,
  loading = false,
  onQueryChange,
  onCategoryChange,
  onToggleSize,
  onToggleColor,
  onToggleMaterial,
  onPriceChange,
  onToggleTag,
  onClear,
  hideCategoryFilter = false,
}: CatalogFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.materials.length > 0 ||
    filters.tags.length > 0;

  return (
    <>
      {/* Mobile toggle + search */}
      <div className="flex flex-col gap-3 lg:hidden mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
          <Input
            placeholder="Buscar producto…"
            value={state.query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-9 h-10 text-sm border-black/10 focus-visible:ring-black"
          />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center gap-2 font-nav text-[11px] uppercase tracking-wider border border-black/10 py-2.5 text-black bg-white hover:bg-black hover:text-white transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filtros
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-black text-white text-[10px] rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          </div>
        )}
        {!loading && (
          <>
            <SearchField value={state.query} onChange={onQueryChange} />

            {!hideCategoryFilter && (
              <CategoryFilter
                options={filters.categories}
                active={state.categoryId}
                onChange={onCategoryChange}
              />
            )}

            {filters.sizes.length > 0 && (
              <SizeFilter options={filters.sizes} active={state.sizes} onToggle={onToggleSize} />
            )}

            {filters.colors.length > 0 && (
              <ColorFilter
                options={filters.colors}
                active={state.colors}
                onToggle={onToggleColor}
              />
            )}

            {filters.materials.length > 0 && (
              <MaterialFilter
                options={filters.materials}
                active={state.materials}
                onToggle={onToggleMaterial}
              />
            )}

            <PriceFilter
              min={filters.priceMin}
              max={filters.priceMax}
              activeMin={state.priceMin}
              activeMax={state.priceMax}
              onChange={onPriceChange}
            />

            {filters.tags.length > 0 && (
              <TagFilter options={filters.tags} active={state.tags} onToggle={onToggleTag} />
            )}

            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="w-full font-nav text-[11px] uppercase tracking-wider border border-black/10 py-2.5 text-black/60 hover:text-black hover:border-black transition-colors"
              >
                Limpiar filtros ({activeCount})
              </button>
            )}
          </>
        )}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-nav text-[13px] uppercase tracking-wider text-black">Filtros</h3>
              <button onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-8">
              <SearchField value={state.query} onChange={onQueryChange} />
              {!hideCategoryFilter && (
                <CategoryFilter
                  options={filters.categories}
                  active={state.categoryId}
                  onChange={onCategoryChange}
                />
              )}
              {filters.sizes.length > 0 && (
                <SizeFilter options={filters.sizes} active={state.sizes} onToggle={onToggleSize} />
              )}
              {filters.colors.length > 0 && (
                <ColorFilter
                  options={filters.colors}
                  active={state.colors}
                  onToggle={onToggleColor}
                />
              )}
              {filters.materials.length > 0 && (
                <MaterialFilter
                  options={filters.materials}
                  active={state.materials}
                  onToggle={onToggleMaterial}
                />
              )}
              <PriceFilter
                min={filters.priceMin}
                max={filters.priceMax}
                activeMin={state.priceMin}
                activeMax={state.priceMax}
                onChange={onPriceChange}
              />
              {filters.tags.length > 0 && (
                <TagFilter options={filters.tags} active={state.tags} onToggle={onToggleTag} />
              )}
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    onClear();
                    setMobileOpen(false);
                  }}
                  className="w-full font-nav text-[11px] uppercase tracking-wider border border-black/10 py-2.5 text-black hover:bg-black hover:text-white transition-colors"
                >
                  Limpiar filtros ({activeCount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-black/40 uppercase mb-3">
      {children}
    </h3>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
      <Input
        placeholder="Buscar producto…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10 text-sm border-black/10 focus-visible:ring-black"
      />
    </div>
  );
}

function CategoryFilter({
  options,
  active,
  onChange,
}: {
  options: { value: string; label: string; count: number }[];
  active: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div>
      <SectionTitle>Categoría</SectionTitle>
      <div className="space-y-1">
        {options.map(({ value, label, count }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              onClick={() => onChange(isActive ? null : value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-sans text-sm transition-colors ${
                isActive ? "bg-black text-white" : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
            >
              <span>{label}</span>
              <span className={`text-[11px] ${isActive ? "text-white/70" : "text-black/30"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SizeFilter({
  options,
  active,
  onToggle,
}: {
  options: { value: string; label: string; count: number }[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Talla</SectionTitle>
      <div className="flex gap-2 flex-wrap">
        {options.map(({ value }) => {
          const isActive = active.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`min-w-[40px] h-10 px-3 font-nav text-[11px] tracking-wider border rounded-lg transition-colors ${
                isActive
                  ? "bg-black text-white border-black"
                  : "border-black/10 text-black/50 hover:border-black/30 hover:text-black"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColorFilter({
  options,
  active,
  onToggle,
}: {
  options: { value: string; label: string; count: number }[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Color</SectionTitle>
      <div className="flex flex-wrap gap-2.5">
        {options.map(({ value }) => {
          const isActive = active.includes(value);
          const swatch = COLOR_SWATCHES[value];
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              title={value}
              className={`group relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                isActive ? "border-black scale-110" : "border-transparent hover:border-black/20"
              }`}
            >
              <span
                className="w-6 h-6 rounded-full border border-black/10"
                style={{ backgroundColor: swatch ?? "#e5e5e5" }}
              />
              {isActive && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check
                    size={12}
                    className={swatch === "#f5f5f5" ? "text-black" : "text-white"}
                    strokeWidth={3}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {options.map(({ value }) => (
          <span
            key={`label-${value}`}
            className={`text-[10px] font-sans ${active.includes(value) ? "text-black font-medium" : "text-black/40"}`}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function MaterialFilter({
  options,
  active,
  onToggle,
}: {
  options: { value: string; label: string; count: number }[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Material</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, count }) => {
          const isActive = active.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`px-3 py-1.5 font-sans text-xs border rounded-lg transition-colors ${
                isActive
                  ? "bg-black text-white border-black"
                  : "border-black/10 text-black/60 hover:border-black/30 hover:text-black"
              }`}
            >
              {value}{" "}
              <span className={isActive ? "text-white/60" : "text-black/30"}>({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PriceFilter({
  min,
  max,
  activeMin,
  activeMax,
  onChange,
}: {
  min: number;
  max: number;
  activeMin: number | null;
  activeMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}) {
  const [localMin, setLocalMin] = useState(activeMin ?? min);
  const [localMax, setLocalMax] = useState(activeMax ?? max);

  const applyRange = () => {
    onChange(localMin, localMax);
  };

  return (
    <div>
      <SectionTitle>Rango de Precios</SectionTitle>
      <div className="flex items-center justify-between font-sans text-[11px] text-black/40 mb-3">
        <span>Bs. {localMin.toLocaleString("es-BO")}</span>
        <span>Bs. {localMax.toLocaleString("es-BO")}</span>
      </div>
      <div className="flex gap-2 mb-3">
        <Input
          type="number"
          min={0}
          placeholder="Mín"
          value={activeMin ?? ""}
          onChange={(e) => {
            const v = e.target.value ? Number(e.target.value) : null;
            onChange(v, activeMax);
          }}
          className="text-xs h-9 border-black/10 focus-visible:ring-black"
        />
        <Input
          type="number"
          min={0}
          placeholder="Máx"
          value={activeMax ?? ""}
          onChange={(e) => {
            const v = e.target.value ? Number(e.target.value) : null;
            onChange(activeMin, v);
          }}
          className="text-xs h-9 border-black/10 focus-visible:ring-black"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={localMax}
        onChange={(e) => {
          const v = Number(e.target.value);
          setLocalMax(v);
        }}
        onMouseUp={applyRange}
        onTouchEnd={applyRange}
        className="w-full accent-black h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
}

function TagFilter({
  options,
  active,
  onToggle,
}: {
  options: { value: string; label: string; count: number }[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  const tagLabelMap: Record<string, string> = {
    featured: "Destacado",
    discount: "En descuento",
    new: "Novedad",
    preorder: "Preventa",
    bestseller: "Más vendido",
    special: "Colección especial",
  };

  return (
    <div>
      <SectionTitle>Etiquetas</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, count }) => {
          const isActive = active.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`px-3 py-1.5 font-nav text-[10px] tracking-wide border rounded-lg transition-colors ${
                isActive
                  ? "bg-black text-white border-black"
                  : "border-black/10 text-black/50 hover:border-black/30 hover:text-black"
              }`}
            >
              {tagLabelMap[value] ?? value}{" "}
              <span className={isActive ? "text-white/60" : "text-black/30"}>({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
