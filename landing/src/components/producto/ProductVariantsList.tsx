"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Product, ProductVariant } from "@/domain/entities/product.entity";

interface ProductVariantsListProps {
  product: Product;
  variants: ProductVariant[];
  sizes: string[];
  colors: { hex: string; name: string; images?: string[] }[];
  basePrice?: number;
}

export function ProductVariantsList({
  product,
  variants,
  sizes,
  colors,
  basePrice,
}: ProductVariantsListProps) {
  const { addItem } = useCartContext();
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null);
  const [addedVariantId, setAddedVariantId] = useState<string | null>(null);

  if (variants.length === 0) return null;

  // Group variants by color
  const byColor: Record<string, ProductVariant[]> = {};
  const noColor: ProductVariant[] = [];

  for (const v of variants) {
    if (v.color) {
      if (!byColor[v.color]) byColor[v.color] = [];
      byColor[v.color].push(v);
    } else {
      noColor.push(v);
    }
  }

  const colorNames = Object.keys(byColor);
  const hasColors = colorNames.length > 0;
  const hasSizes = sizes.length > 0;

  const discountPrice =
    product.isDiscounted && product.discountPercentage
      ? Math.round(product.price * (1 - product.discountPercentage / 100))
      : null;
  const finalPrice = discountPrice ?? basePrice ?? product.price;

  function handleAddVariant(variant: ProductVariant) {
    if (variant.stock <= 0) return;
    setAddingVariantId(variant.id);
    const colorImages = colors.find((c) => c.name === variant.color)?.images;
    const image = colorImages?.[0] ?? product.images[0] ?? "";
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      image,
      size: variant.size ?? undefined,
      color: variant.color ?? undefined,
      categoryId: product.categoryId,
    });
    setAddingVariantId(null);
    setAddedVariantId(variant.id);
    setTimeout(() => setAddedVariantId((prev) => (prev === variant.id ? null : prev)), 2000);
  }

  return (
    <section className="border-t border-black/10 pt-10 mt-10">
      <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
        Disponibilidad
      </p>
      <h2 className="font-serif text-xl md:text-2xl text-black mb-6">Seleccioná tu variante</h2>

      {/* Color groups with size cards */}
      {hasColors && hasSizes && (
        <div className="space-y-8">
          {colorNames.map((colorName, idx) => {
            const colorObj = colors.find((c) => c.name === colorName);
            const colorVariants = byColor[colorName];
            const colorImages = colorObj?.images ?? [];

            return (
              <motion.div
                key={colorName}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white border border-black/10 rounded-xl overflow-hidden"
              >
                {/* Color header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-black/[0.02] border-b border-black/10">
                  {colorObj && (
                    <>
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: colorObj.hex }}
                      />
                      <span className="font-nav text-[12px] tracking-wider uppercase text-black">
                        {colorName}
                      </span>
                    </>
                  )}
                  <span className="text-[10px] text-black/40 font-sans ml-auto">
                    {colorVariants.filter((v) => v.stock > 0).length} de {colorVariants.length}{" "}
                    tallas disponibles
                  </span>
                </div>

                {/* Color images */}
                {colorImages.length > 0 && (
                  <div className="px-5 py-4 border-b border-black/10">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {colorImages.map((img, i) => (
                        <div
                          key={i}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-black/10 shrink-0"
                        >
                          <img
                            src={proxyCldUrl(img)}
                            alt={`${colorName} ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant size cards */}
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {colorVariants.map((v) => {
                    const inStock = v.stock > 0;
                    const isAdding = addingVariantId === v.id;
                    const isAdded = addedVariantId === v.id;
                    const lowStock = v.stock > 0 && v.stock <= 3;

                    return (
                      <div
                        key={`${v.color}-${v.size}`}
                        className={`border rounded-lg p-3 flex flex-col items-center text-center gap-2 transition-all ${
                          inStock
                            ? "border-black/10 hover:border-black/30 hover:shadow-sm"
                            : "border-red-200 opacity-50"
                        }`}
                      >
                        <p className="font-nav text-[12px] font-semibold tracking-wider text-black">
                          {v.size ?? "—"}
                        </p>
                        <p className="font-sans text-[11px] text-black/60">
                          Bs. {finalPrice.toLocaleString("es-BO")}
                        </p>
                        <div className="flex items-center gap-1">
                          {inStock ? (
                            <>
                              <Check size={10} className="text-emerald-600" />
                              <span className="text-[10px] font-sans text-emerald-600">
                                {v.stock} u.
                              </span>
                            </>
                          ) : (
                            <>
                              <X size={10} className="text-red-500" />
                              <span className="text-[10px] font-sans text-red-500">Agotado</span>
                            </>
                          )}
                        </div>
                        {lowStock && (
                          <p className="text-[9px] font-nav text-amber-600 uppercase tracking-wider">
                            Últimas
                          </p>
                        )}
                        {v.sku && <p className="text-[9px] text-black/30 font-mono">{v.sku}</p>}
                        {inStock ? (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full mt-1 text-[10px] font-nav uppercase tracking-wider h-8"
                            onClick={() => handleAddVariant(v)}
                            disabled={isAdding || isAdded}
                          >
                            {isAdded ? (
                              <>
                                <Check size={12} className="mr-1" /> Agregado
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={12} className="mr-1" /> Agregar
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-1 text-[10px] font-nav uppercase tracking-wider h-8 cursor-not-allowed opacity-50"
                            disabled
                          >
                            Agotado
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Only sizes (no colors) */}
      {!hasColors && hasSizes && noColor.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {noColor.map((v, idx) => {
            const inStock = v.stock > 0;
            const isAdding = addingVariantId === v.id;
            const isAdded = addedVariantId === v.id;
            const lowStock = v.stock > 0 && v.stock <= 3;

            return (
              <motion.div
                key={v.size ?? idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`border rounded-lg p-3 flex flex-col items-center text-center gap-2 transition-all ${
                  inStock
                    ? "border-black/10 hover:border-black/30 hover:shadow-sm"
                    : "border-red-200 opacity-50"
                }`}
              >
                <p className="font-nav text-[12px] font-semibold tracking-wider text-black">
                  {v.size ?? "—"}
                </p>
                <p className="font-sans text-[11px] text-black/60">
                  Bs. {finalPrice.toLocaleString("es-BO")}
                </p>
                <div className="flex items-center gap-1">
                  {inStock ? (
                    <>
                      <Check size={10} className="text-emerald-600" />
                      <span className="text-[10px] font-sans text-emerald-600">{v.stock} u.</span>
                    </>
                  ) : (
                    <>
                      <X size={10} className="text-red-500" />
                      <span className="text-[10px] font-sans text-red-500">Agotado</span>
                    </>
                  )}
                </div>
                {lowStock && (
                  <p className="text-[9px] font-nav text-amber-600 uppercase tracking-wider">
                    Últimas
                  </p>
                )}
                {v.sku && <p className="text-[9px] text-black/30 font-mono">{v.sku}</p>}
                {inStock ? (
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full mt-1 text-[10px] font-nav uppercase tracking-wider h-8"
                    onClick={() => handleAddVariant(v)}
                    disabled={isAdding || isAdded}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} className="mr-1" /> Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={12} className="mr-1" /> Agregar
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-1 text-[10px] font-nav uppercase tracking-wider h-8 cursor-not-allowed opacity-50"
                    disabled
                  >
                    Agotado
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Only colors (no sizes) */}
      {hasColors && !hasSizes && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {colorNames.map((colorName, idx) => {
            const colorObj = colors.find((c) => c.name === colorName);
            const colorVariants = byColor[colorName];
            const v = colorVariants[0];
            const inStock = v.stock > 0;
            const isAdding = addingVariantId === v.id;
            const isAdded = addedVariantId === v.id;
            const colorImages = colorObj?.images ?? [];

            return (
              <motion.div
                key={colorName}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`border rounded-lg overflow-hidden transition-all ${
                  inStock
                    ? "border-black/10 hover:border-black/30 hover:shadow-sm"
                    : "border-red-200 opacity-50"
                }`}
              >
                <div className="aspect-square bg-black/5 relative">
                  {colorImages.length > 0 ? (
                    <img
                      src={proxyCldUrl(colorImages[0])}
                      alt={colorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: colorObj?.hex ?? "#ddd" }}
                    />
                  )}
                </div>
                <div className="p-3 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: colorObj?.hex }}
                    />
                    <span className="font-nav text-[11px] tracking-wider uppercase text-black">
                      {colorName}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-black/60">
                    Bs. {finalPrice.toLocaleString("es-BO")}
                  </p>
                  {inStock ? (
                    <span className="text-[10px] font-sans text-emerald-600">
                      {v.stock} unidades
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans text-red-500">Agotado</span>
                  )}
                  {inStock ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full text-[10px] font-nav uppercase tracking-wider h-8"
                      onClick={() => handleAddVariant(v)}
                      disabled={isAdding || isAdded}
                    >
                      {isAdded ? (
                        <>
                          <Check size={12} className="mr-1" /> Agregado
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={12} className="mr-1" /> Agregar
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-[10px] font-nav uppercase tracking-wider h-8 cursor-not-allowed opacity-50"
                      disabled
                    >
                      Agotado
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
