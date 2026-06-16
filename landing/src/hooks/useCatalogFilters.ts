"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Product } from "@/domain/entities/product.entity";
import type { Category } from "@/domain/entities/category.entity";

export interface CatalogFilterState {
  query: string;
  categoryId: string | null;
  sizes: string[];
  colors: string[];
  materials: string[];
  priceMin: number | null;
  priceMax: number | null;
  tags: string[];
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface DynamicFilters {
  categories: FilterOption[];
  sizes: FilterOption[];
  colors: FilterOption[];
  materials: FilterOption[];
  priceMin: number;
  priceMax: number;
  tags: FilterOption[];
}

const DEFAULT_STATE: CatalogFilterState = {
  query: "",
  categoryId: null,
  sizes: [],
  colors: [],
  materials: [],
  priceMin: null,
  priceMax: null,
  tags: [],
};

function parseNumber(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function stateFromParams(params: URLSearchParams): CatalogFilterState {
  return {
    query: params.get("q") ?? "",
    categoryId: params.get("categoria") ?? null,
    sizes: params.getAll("talla"),
    colors: params.getAll("color"),
    materials: params.getAll("material"),
    priceMin: parseNumber(params.get("precio_min")),
    priceMax: parseNumber(params.get("precio_max")),
    tags: params.getAll("etiqueta"),
  };
}

function paramsFromState(state: CatalogFilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (state.query) p.set("q", state.query);
  if (state.categoryId) p.set("categoria", state.categoryId);
  state.sizes.forEach((s) => p.append("talla", s));
  state.colors.forEach((c) => p.append("color", c));
  state.materials.forEach((m) => p.append("material", m));
  if (state.priceMin != null) p.set("precio_min", String(state.priceMin));
  if (state.priceMax != null) p.set("precio_max", String(state.priceMax));
  state.tags.forEach((t) => p.append("etiqueta", t));
  return p;
}

function normalizeSize(size: string): string {
  return size.toUpperCase().trim();
}

function normalizeColor(color: string): string {
  return color
    .toLowerCase()
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function normalizeMaterial(material: string): string {
  return material
    .toLowerCase()
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Generates dynamic filter options from a product list.
 * Only includes values that exist in the current (unfiltered) product set.
 */
function buildDynamicFilters(products: Product[], categories: Category[]): DynamicFilters {
  const sizeSet = new Map<string, number>();
  const colorSet = new Map<string, number>();
  const materialSet = new Map<string, number>();
  const tagSet = new Map<string, number>();
  let priceMin = Infinity;
  let priceMax = 0;

  for (const p of products) {
    for (const s of p.sizes) {
      const ns = normalizeSize(s);
      sizeSet.set(ns, (sizeSet.get(ns) ?? 0) + 1);
    }
    for (const c of p.colors) {
      const nc = normalizeColor(c.name);
      colorSet.set(nc, (colorSet.get(nc) ?? 0) + 1);
    }
    for (const m of p.materials) {
      const nm = normalizeMaterial(m);
      materialSet.set(nm, (materialSet.get(nm) ?? 0) + 1);
    }
    for (const t of p.tags ?? []) {
      tagSet.set(t, (tagSet.get(t) ?? 0) + 1);
    }
    if (p.price < priceMin) priceMin = p.price;
    if (p.price > priceMax) priceMax = p.price;
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const categorySet = new Map<string, number>();
  for (const p of products) {
    categorySet.set(p.categoryId, (categorySet.get(p.categoryId) ?? 0) + 1);
  }

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "UNICO", "U"];
  const toOptions = (map: Map<string, number>, sorter?: (a: FilterOption, b: FilterOption) => number): FilterOption[] => {
    const opts = Array.from(map.entries()).map(([value, count]) => ({ value, label: value, count }));
    if (sorter) return opts.sort(sorter);
    return opts.sort((a, b) => a.label.localeCompare(b.label));
  };

  const sizeSorter = (a: FilterOption, b: FilterOption) => {
    const ia = sizeOrder.indexOf(a.value);
    const ib = sizeOrder.indexOf(b.value);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.label.localeCompare(b.label);
  };

  return {
    categories: Array.from(categorySet.entries()).map(([value, count]) => ({
      value,
      label: categoryMap.get(value) ?? value,
      count,
    })),
    sizes: toOptions(sizeSet, sizeSorter),
    colors: toOptions(colorSet),
    materials: toOptions(materialSet),
    priceMin: priceMin === Infinity ? 0 : Math.floor(priceMin / 10) * 10,
    priceMax: priceMax === 0 ? 1000 : Math.ceil(priceMax / 10) * 10,
    tags: toOptions(tagSet),
  };
}

function applyFilters(products: Product[], state: CatalogFilterState): Product[] {
  return products.filter((p) => {
    if (state.query) {
      const q = state.query.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.categoryName.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (state.categoryId && p.categoryId !== state.categoryId) return false;
    if (state.sizes.length > 0 && !state.sizes.some((s) => p.sizes.includes(s))) return false;
    if (state.colors.length > 0 && !state.colors.some((c) => p.colors.some((pc) => pc.name === c)))
      return false;
    if (state.materials.length > 0 && !state.materials.some((m) => p.materials.includes(m)))
      return false;
    if (state.priceMin != null && p.price < state.priceMin) return false;
    if (state.priceMax != null && p.price > state.priceMax) return false;
    if (state.tags.length > 0 && !state.tags.some((t) => p.tags?.includes(t))) return false;
    return true;
  });
}

function resolveCategoryId(raw: string | null, categories: Category[]): string | null {
  if (!raw) return null;
  const match = categories.find((c) => c.slug === raw || c.id === raw);
  return match ? match.id : raw;
}

export function useCatalogFilters(products: Product[], categories: Category[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = useState<CatalogFilterState>(() => {
    const raw = stateFromParams(new URLSearchParams(searchParams.toString()));
    return { ...raw, categoryId: resolveCategoryId(raw.categoryId, categories) };
  });

  // Sync state → URL (debounced by React batching)
  useEffect(() => {
    const params = paramsFromState(state);
    const current = searchParams.toString();
    if (params.toString() !== current) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [state, pathname, router, searchParams]);

  const filtered = useMemo(() => applyFilters(products, state), [products, state]);

  const filters = useMemo(() => buildDynamicFilters(products, categories), [products, categories]);

  const setQuery = useCallback((query: string) => setState((s) => ({ ...s, query })), []);
  const setCategory = useCallback(
    (categoryId: string | null) => setState((s) => ({ ...s, categoryId })),
    []
  );
  const toggleSize = useCallback((size: string) => {
    setState((s) => ({
      ...s,
      sizes: s.sizes.includes(size) ? s.sizes.filter((x) => x !== size) : [...s.sizes, size],
    }));
  }, []);
  const toggleColor = useCallback((color: string) => {
    setState((s) => ({
      ...s,
      colors: s.colors.includes(color) ? s.colors.filter((x) => x !== color) : [...s.colors, color],
    }));
  }, []);
  const toggleMaterial = useCallback((material: string) => {
    setState((s) => ({
      ...s,
      materials: s.materials.includes(material)
        ? s.materials.filter((x) => x !== material)
        : [...s.materials, material],
    }));
  }, []);
  const setPriceRange = useCallback((min: number | null, max: number | null) => {
    setState((s) => ({ ...s, priceMin: min, priceMax: max }));
  }, []);
  const toggleTag = useCallback((tag: string) => {
    setState((s) => ({
      ...s,
      tags: s.tags.includes(tag) ? s.tags.filter((x) => x !== tag) : [...s.tags, tag],
    }));
  }, []);
  const clearFilters = useCallback(() => setState(DEFAULT_STATE), []);

  const activeCount =
    (state.query ? 1 : 0) +
    (state.categoryId ? 1 : 0) +
    state.sizes.length +
    state.colors.length +
    state.materials.length +
    (state.priceMin != null || state.priceMax != null ? 1 : 0) +
    state.tags.length;

  return {
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
  };
}
