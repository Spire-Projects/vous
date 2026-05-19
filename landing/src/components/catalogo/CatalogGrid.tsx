"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/domain/entities/product.entity";

type SortKey = "relevantes" | "precio-asc" | "precio-desc" | "nuevos";

function sortProducts(products: Product[], key: SortKey): Product[] {
  const copy = [...products];
  if (key === "precio-asc") return copy.sort((a, b) => a.price - b.price);
  if (key === "precio-desc") return copy.sort((a, b) => b.price - a.price);
  if (key === "nuevos")
    return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return copy.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function CatalogGrid() {
  const { products, loading, error } = useProducts();
  const [sort, setSort] = useState<SortKey>("relevantes");

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-8">
        <p className="font-sans text-sm text-vous-gray">
          {loading ? (
            "Cargando productos…"
          ) : (
            <>
              <span className="text-vous-soft-black font-medium">{sorted.length}</span> productos
            </>
          )}
        </p>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevantes">Más Relevantes</SelectItem>
            <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="nuevos">Nuevas Llegadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-vous-gray-light/30 mb-4" />
              <div className="h-3 bg-vous-gray-light/30 w-1/3 mb-2" />
              <div className="h-5 bg-vous-gray-light/30 w-3/4 mb-2" />
              <div className="h-3 bg-vous-gray-light/30 w-1/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="font-sans text-vous-gray">{error}</p>
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-vous-soft-black">Sin productos disponibles</p>
          <p className="font-sans text-vous-gray mt-2">
            Vuelve pronto para descubrir nuevas piezas.
          </p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {sorted.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}
