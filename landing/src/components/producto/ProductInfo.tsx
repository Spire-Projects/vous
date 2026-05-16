"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import type { Product } from "@/domain/entities/product.entity";

function buildWhatsAppHref(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  const encoded = encodeURIComponent(message || "Hola, tengo una consulta");
  return `https://wa.me/${clean}?text=${encoded}`;
}

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCartContext();
  const { config } = useSiteConfig();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const discountPrice =
    product.isDiscounted && product.discountPercentage
      ? Math.round(product.price * (1 - product.discountPercentage / 100))
      : null;

  const canAdd = !product.hasVariants || (!!selectedSize && !!selectedColor);

  function handleAddToCart() {
    if (product.hasVariants && (!selectedSize || !selectedColor)) {
      setError("Selecciona talla y color antes de agregar al carrito.");
      return;
    }
    setError(null);
    addItem({
      productId: product.id,
      name: product.name,
      price: discountPrice ?? product.price,
      quantity: 1,
      image: product.images[0] ?? "",
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    });
  }

  const whatsappNumber = config?.whatsappNumber ?? "59165359595";
  const whatsappMessage =
    config?.whatsappMessage ?? `Hola, tengo una consulta sobre ${product.name}`;
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);

  return (
    <div className="flex flex-col gap-6 max-w-md w-full">
      <p className="font-sans text-xs text-vous-gray tracking-wide">
        <Link href="/catalogo" className="hover:text-vous-gold transition-colors">
          Catálogo
        </Link>
        <span className="mx-2 text-vous-gray-light">/</span>
        <span>{product.categoryName}</span>
        <span className="mx-2 text-vous-gray-light">/</span>
        <span className="text-vous-soft-black">{product.name}</span>
      </p>

      <div>
        {product.badge && (
          <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold mb-1">
            {product.badge}
          </p>
        )}
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <p className="font-serif text-2xl text-vous-soft-black">
            Bs. {(discountPrice ?? product.price).toLocaleString("es-BO")}
          </p>
          {discountPrice && (
            <p className="font-serif text-lg text-vous-gray line-through">
              Bs. {product.price.toLocaleString("es-BO")}
            </p>
          )}
        </div>
      </div>

      {product.colors.length > 0 && (
        <div>
          <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray mb-2">
            Color
          </p>
          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedColor(c.name)}
                style={{ backgroundColor: c.hex }}
                aria-label={c.name}
                aria-pressed={selectedColor === c.name}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedColor === c.name
                    ? "border-vous-gold scale-110"
                    : "border-transparent hover:border-vous-gray-light"
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray">Talla</p>
          </div>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-11 h-11 font-sans text-sm border transition-colors ${
                  selectedSize === s
                    ? "bg-vous-soft-black text-white border-vous-soft-black"
                    : "border-vous-gray-light text-vous-gray hover:border-vous-soft-black hover:text-vous-soft-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="default"
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!canAdd || product.stock <= 0}
        >
          <ShoppingBag size={15} />
          {product.stock <= 0 ? "Agotado" : "Agregar al Carrito"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12"
          aria-label="Guardar en favoritos"
        >
          <Heart size={16} />
        </Button>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold hover:text-vous-gold-dark transition-colors"
      >
        <MessageCircle size={14} /> Consultar por WhatsApp
      </a>

      {product.materials.length > 0 && (
        <div className="border-t border-vous-gray-light/40 pt-5 grid grid-cols-3 gap-4">
          {product.materials.map((m) => (
            <div key={m}>
              <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1">
                Material
              </p>
              <p className="font-sans text-sm text-vous-soft-black">{m}</p>
            </div>
          ))}
        </div>
      )}

      <p className="font-sans text-sm text-vous-gray leading-relaxed border-t border-vous-gray-light/40 pt-5">
        {product.description || product.detail}
      </p>
    </div>
  );
}
