import Link from "next/link";
import type { Product } from "@/domain/entities/product.entity";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-black/10 pt-14 mt-14">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-black">
          Productos Relacionados
        </h2>
        <Link
          href="/catalogo"
          className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-black/50 border-b border-black hover:text-black hover:border-black transition-colors pb-0.5"
        >
          Ver Todo
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {products.map((p) => (
          <Link key={p.id} href={`/producto/${p.slug}`} className="group block">
            <div className="aspect-[3/4] bg-white overflow-hidden mb-3">
              {p.images[0] ? (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#d4cfc6] to-[#b0a898]" />
              )}
            </div>
            <h3 className="font-serif text-base text-black group-hover:text-black transition-colors">
              {p.name}
            </h3>
            <p className="font-sans text-sm text-black/50 mt-1">
              Bs. {p.price.toLocaleString("es-BO")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
