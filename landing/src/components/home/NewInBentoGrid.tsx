import Link from "next/link";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Category } from "@/domain/entities/category.entity";

const PLACEHOLDER_BGS = [
  "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]",
  "from-[#3d3d38] to-[#1a1a18]",
  "from-[#6b5a3a] to-[#3d2e15]",
] as const;

interface NewInBentoGridProps {
  categories: Category[];
}

export function NewInBentoGrid({ categories }: NewInBentoGridProps) {
  const featured = categories[0];
  const sideCards = categories.slice(1, 3);

  if (categories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        <div className="col-span-12 md:col-span-7 relative overflow-hidden bg-gradient-to-b from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]">
          <div className="absolute bottom-8 left-8 text-white z-10">
            <p className="font-nav text-[11px] tracking-[0.2em] text-white/80 uppercase mb-2">
              COLECCIÓN 01
            </p>
            <h3 className="font-serif text-3xl text-white mb-6">Siluetas Urbanas</h3>
            <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-white text-vous-soft-black px-5 py-2.5">
              Comprar Ahora
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-6">
          <div className="relative overflow-hidden bg-gradient-to-b from-[#3d3d38] to-[#1a1a18]">
            <div className="absolute top-4 left-4">
              <span className="bg-vous-gold text-vous-soft-black px-3 py-1 font-nav text-[10px] font-semibold tracking-[0.15em]">
                LIMITADO
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-b from-[#6b5a3a] to-[#3d2e15]">
            <div className="absolute bottom-6 right-6 text-right">
              <h4 className="font-serif text-2xl text-white uppercase">Accesorios</h4>
              <p className="font-nav text-[11px] tracking-[0.15em] text-white/70">
                Serie Firma en Oro
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-black/40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
      {/* Featured large card */}
      {featured && (
        <Link
          href={`/catalogo?categoria=${featured.slug}`}
          className="col-span-12 md:col-span-7 relative group overflow-hidden block h-[400px] md:h-full"
        >
          {featured.banner || featured.image ? (
            <img
              src={proxyCldUrl(featured.banner ?? featured.image ?? "")}
              alt={featured.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white z-10">
            <p className="font-nav text-[11px] tracking-[0.2em] text-white/80 uppercase mb-2">
              COLECCIÓN 01
            </p>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">{featured.name}</h3>
            <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-white text-vous-soft-black px-5 py-2.5 hover:bg-vous-gold transition-colors">
              Comprar Ahora
            </span>
          </div>
        </Link>
      )}

      {/* Side cards */}
      <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-6 h-[400px] md:h-full">
        {sideCards.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/catalogo?categoria=${cat.slug}`}
            className="relative group overflow-hidden block"
          >
            {cat.banner || cat.image ? (
              <img
                src={proxyCldUrl(cat.banner ?? cat.image ?? "")}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-b ${PLACEHOLDER_BGS[index % PLACEHOLDER_BGS.length]}`}
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            {index === 0 && (
              <div className="absolute top-4 left-4">
                <span className="bg-vous-gold text-vous-soft-black px-3 py-1 font-nav text-[10px] font-semibold tracking-[0.15em]">
                  LIMITADO
                </span>
              </div>
            )}
            {index === 1 && (
              <>
                <div className="absolute bottom-6 right-6 text-right">
                  <h4 className="font-serif text-2xl text-white uppercase">{cat.name}</h4>
                  <p className="font-nav text-[11px] tracking-[0.15em] text-white/70">
                    Serie Firma en Oro
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-black/40" />
              </>
            )}
          </Link>
        ))}
        {sideCards.length < 2 &&
          Array.from({ length: 2 - sideCards.length }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className={`relative overflow-hidden bg-gradient-to-b ${PLACEHOLDER_BGS[(i + sideCards.length) % PLACEHOLDER_BGS.length]}`}
            />
          ))}
      </div>
    </div>
  );
}
