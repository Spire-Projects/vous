"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { useAuthContext } from "@/context/AuthContext";

export function ShopTheLookGrid() {
  const { products, loading } = useProducts();
  const { user } = useAuthContext();

  // Use featured products first, then fall back to first 4 visible products
  const lookProducts = products
    .filter((p) => p.isFeatured)
    .slice(0, 4);

  if (!loading && lookProducts.length === 0) return null;

  return (
    <div className="mt-20 md:mt-24">
      <h3 className="font-serif text-2xl md:text-[28px] font-medium text-vous-soft-black mb-10 md:mb-12 uppercase italic">
        Completa el Look
      </h3>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-vous-gray-light/40" />
          ))}
        </div>
      )}

      {!loading && lookProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {lookProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              userRole={user?.role}
              userUid={user?.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
}
