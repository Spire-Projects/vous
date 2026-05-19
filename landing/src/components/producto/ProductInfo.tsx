"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import type { Product } from "@/domain/entities/product.entity";

function buildWhatsAppHref(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  const encoded = encodeURIComponent(message || "Hola, tengo una consulta");
  return `https://wa.me/${clean}?text=${encoded}`;
}

/** Mapea el texto del badge al estilo de color correspondiente */
function badgeStyle(badge: string): string {
  const lower = badge.toLowerCase();
  if (lower.includes("nuevo") || lower.includes("new")) return "bg-vous-gold text-vous-soft-black";
  if (lower.includes("descuento") || lower.includes("sale") || lower.includes("oferta"))
    return "bg-red-600 text-white";
  if (lower.includes("preventa") || lower.includes("pre-venta")) return "bg-blue-700 text-white";
  if (lower.includes("exclusivo") || lower.includes("exclusive"))
    return "bg-vous-soft-black text-white";
  return "bg-vous-gold text-vous-soft-black";
}

/** Indica el estado de stock con un chip visual */
function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center font-nav text-[10px] tracking-[0.15em] uppercase px-2 py-1 bg-red-50 text-red-600 border border-red-200">
        Agotado
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="inline-flex items-center font-nav text-[10px] tracking-[0.15em] uppercase px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200">
        Últimas {stock} unidades
      </span>
    );
  }
  return (
    <span className="inline-flex items-center font-nav text-[10px] tracking-[0.15em] uppercase px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
      En stock
    </span>
  );
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
  const [added, setAdded] = useState(false);

  const discountPrice =
    product.isDiscounted && product.discountPercentage
      ? Math.round(product.price * (1 - product.discountPercentage / 100))
      : null;

  function handleAddToCart() {
    if (product.hasVariants && (!selectedSize || !selectedColor)) {
      setError(
        product.sizes.length > 0 && product.colors.length > 0
          ? "Selecciona talla y color antes de agregar al carrito."
          : product.sizes.length > 0
            ? "Selecciona una talla antes de agregar al carrito."
            : "Selecciona un color antes de agregar al carrito."
      );
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const whatsappNumber = config?.whatsappNumber ?? "59165359595";
  const whatsappMessage =
    config?.whatsappMessage ?? `Hola, me interesa el producto "${product.name}"`;
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);

  return (
    <div className="flex flex-col gap-6 max-w-md w-full">
      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación">
        <ol className="flex items-center flex-wrap gap-1 font-nav text-[10px] tracking-[0.12em] uppercase text-vous-gray">
          <li>
            <Link href="/" className="hover:text-vous-gold transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <ChevronRight size={10} className="text-vous-gray-light" />
          </li>
          <li>
            <Link href="/categorias" className="hover:text-vous-gold transition-colors">
              {product.categoryName}
            </Link>
          </li>
          <li>
            <ChevronRight size={10} className="text-vous-gray-light" />
          </li>
          <li className="text-vous-soft-black truncate max-w-[160px]" title={product.name}>
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Badges */}
      {(product.badge || product.isDiscounted) && (
        <div className="flex flex-wrap gap-2">
          {product.badge && (
            <span
              className={`font-nav text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 ${badgeStyle(product.badge)}`}
            >
              {product.badge}
            </span>
          )}
          {product.isDiscounted && product.discountPercentage && (
            <span className="font-nav text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 bg-red-600 text-white">
              -{product.discountPercentage}% descuento
            </span>
          )}
        </div>
      )}

      {/* Nombre y precio */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black leading-tight">
          {product.name}
        </h1>
        <div className="flex items-baseline gap-3 mt-3">
          <p className="font-serif text-2xl text-vous-soft-black">
            Bs. {(discountPrice ?? product.price).toLocaleString("es-BO")}
          </p>
          {discountPrice && (
            <p className="font-serif text-lg text-vous-gray line-through">
              Bs. {product.price.toLocaleString("es-BO")}
            </p>
          )}
        </div>
        <div className="mt-3">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Selector de color */}
      {product.colors.length > 0 && (
        <div>
          <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray mb-2">
            Color
            {selectedColor && (
              <span className="ml-2 text-vous-soft-black normal-case tracking-normal font-sans text-xs">
                — {selectedColor}
              </span>
            )}
          </p>
          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setSelectedColor(c.name);
                  setError(null);
                }}
                style={{ backgroundColor: c.hex }}
                aria-label={c.name}
                aria-pressed={selectedColor === c.name}
                disabled={product.stock <= 0}
                className={`w-7 h-7 rounded-full border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
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

      {/* Selector de talla */}
      {product.sizes.length > 0 && (
        <div>
          <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray mb-2">
            Talla
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelectedSize(s);
                  setError(null);
                }}
                disabled={product.stock <= 0}
                aria-pressed={selectedSize === s}
                className={`min-w-[44px] h-11 px-3 font-sans text-sm border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
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

      {/* Error de validación */}
      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      {/* CTA principal */}
      <div className="flex gap-3">
        <Button
          variant="default"
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingBag size={15} />
          {product.stock <= 0 ? "Agotado" : added ? "¡Agregado!" : "Agregar al Carrito"}
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

      {/* WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold hover:text-vous-gold/80 transition-colors"
      >
        <MessageCircle size={14} /> Consultar por WhatsApp
      </a>

      {/* Materiales / Atributos */}
      {product.materials.length > 0 && (
        <div className="border-t border-vous-gray-light/40 pt-5">
          <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-3">
            Composición
          </p>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((m) => (
              <span
                key={m}
                className="font-sans text-xs text-vous-soft-black border border-vous-gray-light/60 px-3 py-1.5"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Descripción */}
      {product.description && (
        <div className="border-t border-vous-gray-light/40 pt-5">
          <p className="font-sans text-sm text-vous-gray leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Detalle adicional */}
      {product.detail && product.detail !== product.description && (
        <div className="border-t border-vous-gray-light/40 pt-5">
          <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-2">
            Detalle
          </p>
          <p className="font-sans text-sm text-vous-gray leading-relaxed">{product.detail}</p>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="font-nav text-[9px] tracking-[0.1em] uppercase text-vous-gray border border-vous-gray-light/40 px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
