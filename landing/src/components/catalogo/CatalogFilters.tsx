"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { DynamicFilters, CatalogFilterState } from "@/hooks/useCatalogFilters";

interface CatalogFiltersProps {
  filters: DynamicFilters;
  state: CatalogFilterState;
  activeCount: number;
  onQueryChange: (q: string) => void;
  onCategoryChange: (id: string | null) => void;
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onToggleMaterial: (mat: string) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
  onToggleTag: (tag: string) => void;
  onClear: () => void;
}

export function CatalogFilters({
  filters,
  state,
  activeCount,
  onQueryChange,
  onCategoryChange,
  onToggleSize,
  onToggleColor,
  onToggleMaterial,
  onPriceChange,
  onToggleTag,
  onClear,
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
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
          <Input
            placeholder="Buscar producto…"
            value={state.query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center gap-2 font-nav text-[11px] uppercase tracking-wider border border-vous-border py-2.5 text-vous-soft-black"
        >
          <SlidersHorizontal size={14} />
          Filtros {activeCount > 0 && <span className="text-vous-gold">({activeCount})</span>}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 space-y-8">
        <SearchField value={state.query} onChange={onQueryChange} />
        <CategoryFilter
          options={filters.categories}
          active={state.categoryId}
          onChange={onCategoryChange}
        />
        {filters.sizes.length > 0 && (
          <SizeFilter options={filters.sizes} active={state.sizes} onToggle={onToggleSize} />
        )}
        {filters.colors.length > 0 && (
          <ColorFilter options={filters.colors} active={state.colors} onToggle={onToggleColor} />
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
            className="font-nav text-[11px] uppercase tracking-wider text-vous-gray hover:text-vous-black underline underline-offset-4"
          >
            Limpiar filtros ({activeCount})
          </button>
        )}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-vous-soft-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-vous-warm-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-nav text-[13px] uppercase tracking-wider text-vous-black">
                Filtros
              </h3>
              <button onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-8">
              <SearchField value={state.query} onChange={onQueryChange} />
              <CategoryFilter
                options={filters.categories}
                active={state.categoryId}
                onChange={onCategoryChange}
              />
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
                  className="w-full font-nav text-[11px] uppercase tracking-wider border border-vous-border py-2.5 text-vous-soft-black hover:bg-vous-white transition-colors"
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

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
      <Input
        placeholder="Buscar producto…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
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
      <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
        Categoría
      </h3>
      <ul className="space-y-2">
        {options.map(({ value, label, count }) => (
          <li key={value}>
            <button
              onClick={() => onChange(active === value ? null : value)}
              className={`w-full text-left font-sans text-sm transition-colors flex items-center justify-between ${
                active === value
                  ? "text-vous-soft-black font-medium"
                  : "text-vous-gray hover:text-vous-soft-black"
              }`}
            >
              <span>
                {label}
                <span className="ml-1 text-vous-gray-light">({count})</span>
              </span>
              {active === value && <span className="text-vous-gold">●</span>}
            </button>
          </li>
        ))}
      </ul>
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
      <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
        Talla
      </h3>
      <div className="flex gap-2 flex-wrap">
        {options.map(({ value, count }) => (
          <button
            key={value}
            onClick={() => onToggle(value)}
            title={`${value} (${count})`}
            className={`w-10 h-10 font-sans text-xs border transition-colors ${
              active.includes(value)
                ? "bg-vous-soft-black text-white border-vous-soft-black"
                : "border-vous-gray-light text-vous-gray hover:border-vous-soft-black"
            }`}
          >
            {value}
          </button>
        ))}
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
      <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
        Color
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, count }) => (
          <button
            key={value}
            onClick={() => onToggle(value)}
            title={`${value} (${count})`}
            className={`px-2.5 py-1 font-sans text-xs border transition-colors ${
              active.includes(value)
                ? "bg-vous-soft-black text-white border-vous-soft-black"
                : "border-vous-gray-light text-vous-gray hover:border-vous-soft-black"
            }`}
          >
            {value}
          </button>
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
      <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
        Material
      </h3>
      <ul className="space-y-2.5">
        {options.map(({ value, label, count }) => (
          <li key={value} className="flex items-center gap-2">
            <Checkbox
              id={`mat-${value}`}
              checked={active.includes(value)}
              onCheckedChange={() => onToggle(value)}
            />
            <Label
              htmlFor={`mat-${value}`}
              className="font-sans text-sm normal-case tracking-normal text-vous-gray cursor-pointer"
            >
              {label} <span className="text-vous-gray-light">({count})</span>
            </Label>
          </li>
        ))}
      </ul>
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

  return (
    <div>
      <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
        Rango de Precios
      </h3>
      <div className="flex items-center justify-between font-sans text-xs text-vous-gray mb-2">
        <span>Bs. {localMin.toLocaleString("es-BO")}</span>
        <span>Bs. {localMax.toLocaleString("es-BO")}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={localMax}
        onChange={(e) => {
          const v = Number(e.target.value);
          setLocalMax(v);
          onChange(localMin, v);
        }}
        className="w-full accent-vous-gold mb-3"
      />
      <div className="flex gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Mín"
          value={activeMin ?? ""}
          onChange={(e) => {
            const v = e.target.value ? Number(e.target.value) : null;
            onChange(v, activeMax);
          }}
          className="text-xs"
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
          className="text-xs"
        />
      </div>
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
      <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
        Etiquetas
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, count }) => (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-2.5 py-1 font-nav text-[10px] tracking-wide border transition-colors ${
              active.includes(value)
                ? "bg-vous-soft-black text-white border-vous-soft-black"
                : "border-vous-gray-light text-vous-gray hover:border-vous-soft-black"
            }`}
          >
            {tagLabelMap[value] ?? value} ({count})
          </button>
        ))}
      </div>
    </div>
  );
}
