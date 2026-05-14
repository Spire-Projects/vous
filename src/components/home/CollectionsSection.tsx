import Link from "next/link";

const COLLECTIONS = [
  {
    id: "ethereal",
    num: "01 / Ethereal",
    title: "The Minimalist Line",
    desc: "Un estudio en blanco y luz. Explorando los límites entre la arquitectura y la vestimenta.",
    href: "/catalogo?coleccion=minimalist",
    bg: "from-[#d4cfc6] via-[#b8b0a4] to-[#8a8278]",
  },
  {
    id: "noir",
    num: "02 / Noir",
    title: "Serie Nocturna Urbana",
    desc: "Diseñada para la ciudad que nunca duerme. Negros profundos, sastrería impecable y acentos dorados.",
    href: "/catalogo?coleccion=urban-night",
    bg: "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]",
  },
] as const;

export function CollectionsSection() {
  return (
    <section className="bg-vous-soft-black py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="mb-12 md:mb-16">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-2">
            Temporada 2025
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-white">
            Nuestras Colecciones
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {COLLECTIONS.map(({ id, num, title, desc, href, bg }) => (
            <Link
              key={id}
              href={href}
              className="group relative block aspect-[4/5] overflow-hidden bg-vous-gray-dark"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${bg} group-hover:scale-105 transition-transform duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="font-nav text-[11px] tracking-[0.2em] text-vous-gold uppercase mb-2">
                  {num}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{title}</h3>
                <p className="font-sans text-sm text-white/70 leading-relaxed mb-4 hidden md:block">
                  {desc}
                </p>
                <span className="font-nav text-[12px] font-semibold tracking-[0.12em] uppercase text-vous-gold border-b border-vous-gold/50 pb-0.5 group-hover:border-vous-gold transition-colors">
                  Explorar Colección
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
