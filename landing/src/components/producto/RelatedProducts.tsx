import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Product } from "@/domain/entities/product.entity";

interface RelatedProductsProps {
  products: Product[];
  categorySlug?: string;
}

export function RelatedProducts({ products, categorySlug }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-black/10 pt-14 mt-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
            Descubre más
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-black">Productos Relacionados</h2>
        </div>
        {categorySlug && (
          <Link
            href={`/categoria/${categorySlug}`}
            className="hidden md:flex items-center gap-1.5 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors pb-0.5"
          >
            Ver categoría <ArrowRight size={12} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {products.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Link href={`/producto/${p.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-3">
                {p.images[0] ? (
                  <img
                    src={proxyCldUrl(p.images[0])}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-[#d4cfc6] to-[#b0a898]" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                  <span className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2 backdrop-blur-sm">
                    Vista Rápida
                  </span>
                </div>
              </div>
              <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
                {p.categoryName}
              </p>
              <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors leading-tight">
                {p.name}
              </h3>
              <p className="font-sans text-sm text-black/50 mt-1">
                Bs. {p.price.toLocaleString("es-BO")}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
