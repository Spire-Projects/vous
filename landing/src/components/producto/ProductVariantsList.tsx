"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { ProductVariant } from "@/domain/entities/product.entity";

interface ProductVariantsListProps {
  variants: ProductVariant[];
  sizes: string[];
  colors: { hex: string; name: string; images?: string[] }[];
}

export function ProductVariantsList({ variants, sizes, colors }: ProductVariantsListProps) {
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

  return (
    <section className="border-t border-black/10 pt-10 mt-10">
      <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
        Disponibilidad
      </p>
      <h2 className="font-serif text-xl md:text-2xl text-black mb-6">
        Variantes del Producto
      </h2>

      {/* Color + Size grid */}
      {hasColors && hasSizes && (
        <div className="space-y-6">
          {colorNames.map((colorName, idx) => {
            const colorObj = colors.find((c) => c.name === colorName);
            const colorVariants = byColor[colorName];
            const colorImage = colorObj?.images?.[0] ?? colorObj?.hex;

            return (
              <motion.div
                key={colorName}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white border border-black/10 rounded-lg overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3 bg-black/[0.02] border-b border-black/10">
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
                    {colorVariants.filter((v) => v.stock > 0).length} de {colorVariants.length} tallas disponibles
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px bg-black/10">
                  {colorVariants.map((v) => {
                    const inStock = v.stock > 0;
                    const lowStock = v.stock > 0 && v.stock <= 3;
                    return (
                      <div
                        key={`${v.color}-${v.size}`}
                        className={`bg-white p-3 text-center transition-colors ${
                          inStock ? "hover:bg-black/[0.02]" : "opacity-50"
                        }`}
                      >
                        <p className="font-nav text-[12px] font-semibold tracking-wider text-black mb-1">
                          {v.size ?? "—"}
                        </p>
                        <div className="flex items-center justify-center gap-1">
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
                              <span className="text-[10px] font-sans text-red-500">
                                Agotado
                              </span>
                            </>
                          )}
                        </div>
                        {lowStock && (
                          <p className="text-[9px] font-nav text-amber-600 mt-0.5 uppercase tracking-wider">
                            Ultimas
                          </p>
                        )}
                        {v.sku && (
                          <p className="text-[9px] text-black/30 font-mono mt-1">{v.sku}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {colorObj?.images && colorObj.images.length > 0 && (
                  <div className="px-4 py-3 border-t border-black/10">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {colorObj.images.map((img, i) => (
                        <img
                          key={i}
                          src={proxyCldUrl(img)}
                          alt={`${colorName} ${i + 1}`}
                          className="w-14 h-14 object-cover border border-black/10 rounded shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Only sizes (no colors) */}
      {!hasColors && hasSizes && noColor.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {noColor.map((v, idx) => {
            const inStock = v.stock > 0;
            return (
              <motion.div
                key={v.size ?? idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`border rounded-lg p-3 text-center ${
                  inStock ? "border-black/10" : "border-red-200 opacity-60"
                }`}
              >
                <p className="font-nav text-[12px] font-semibold tracking-wider text-black mb-1">
                  {v.size ?? "—"}
                </p>
                {inStock ? (
                  <span className="text-[10px] font-sans text-emerald-600">
                    {v.stock} unidades
                  </span>
                ) : (
                  <span className="text-[10px] font-sans text-red-500">Agotado</span>
                )}
                {v.sku && (
                  <p className="text-[9px] text-black/30 font-mono mt-1">{v.sku}</p>
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

            return (
              <motion.div
                key={colorName}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`border rounded-lg overflow-hidden ${
                  inStock ? "border-black/10" : "border-red-200 opacity-60"
                }`}
              >
                <div className="aspect-square bg-black/5 relative">
                  {colorObj?.images?.[0] ? (
                    <img
                      src={proxyCldUrl(colorObj.images[0])}
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
                <div className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: colorObj?.hex }}
                    />
                    <span className="font-nav text-[11px] tracking-wider uppercase text-black">
                      {colorName}
                    </span>
                  </div>
                  {inStock ? (
                    <span className="text-[10px] font-sans text-emerald-600">
                      {v.stock} unidades
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans text-red-500">Agotado</span>
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
