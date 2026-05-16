import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CARDS = [
  {
    slug: "siluetas-urbanas",
    name: "Siluetas Urbanas",
    category: "Calzado",
    price: "Bs. 890",
    badge: null,
    bg: "from-[#2a2015] to-[#1a1a18]",
  },
  {
    slug: "serie-firma-oro",
    name: "Serie Firma en Oro",
    category: "Accesorios",
    price: "Bs. 450",
    badge: "LIMITADO",
    bg: "from-[#1e1a0e] to-[#2d2510]",
  },
] as const;

const FEATURED = {
  slug: "coleccion-01",
  label: "COLECCIÓN 01",
  name: "Siluetas Urbanas",
  bg: "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]",
};

export function NewInSection() {
  return (
    <section className="bg-vous-warm-white py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-2">
              Últimas Piezas
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black">
              Nuevas Llegadas
            </h2>
            <p className="font-sans text-sm text-vous-gray mt-2">
              Nuestra última expresión de lujo urbano.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link href="/catalogo">Ver Todo</Link>
          </Button>
        </div>

        {/* Grid: 2 standard + 1 featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Standard cards */}
          {CARDS.map(({ slug, name, category, price, badge, bg }) => (
            <Link key={slug} href={`/catalogo/${slug}`} className="group block">
              <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-b ${bg} mb-4`}>
                {badge && <Badge className="absolute top-3 left-3">{badge}</Badge>}
              </div>
              <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray mb-1">
                {category}
              </p>
              <h3 className="font-serif text-xl text-vous-soft-black group-hover:text-vous-gold transition-colors">
                {name}
              </h3>
              <p className="font-sans text-sm text-vous-gray mt-1">{price}</p>
            </Link>
          ))}

          {/* Featured card */}
          <Link
            href={`/catalogo/${FEATURED.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-gradient-to-b block"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${FEATURED.bg} group-hover:scale-105 transition-transform duration-500`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold mb-1">
                {FEATURED.label}
              </p>
              <h3 className="font-serif text-2xl text-white mb-4">{FEATURED.name}</h3>
              <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-vous-gold text-vous-soft-black px-5 py-2.5">
                Comprar Ahora
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalogo">Ver Todo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
