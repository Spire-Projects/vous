import Link from "next/link";

const CATEGORIES = [
  { slug: "ropa-abrigo", name: "Ropa de Abrigo", count: 18, bg: "from-[#1a1a18] to-[#2a2015]" },
  { slug: "tejidos", name: "Tejidos", count: 12, bg: "from-[#3d3d38] to-[#1a1a18]" },
  { slug: "camisas", name: "Camisas", count: 9, bg: "from-[#d4cfc6] to-[#b0a898]" },
  { slug: "pantalones", name: "Pantalones", count: 11, bg: "from-[#2a2015] to-[#1a1a18]" },
  { slug: "accesorios", name: "Accesorios", count: 8, bg: "from-[#6b5a3a] to-[#3d2e15]" },
  { slug: "calzado", name: "Calzado", count: 6, bg: "from-[#b8b0a4] to-[#8a8278]" },
];

export default function CategoriasPage() {
  return (
    <div className="bg-vous-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-vous-soft-black py-14 md:py-20 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-3">
            Explorar
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-white">Categorías</h1>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {CATEGORIES.map(({ slug, name, count, bg }) => (
            <Link key={slug} href={`/catalogo?categoria=${slug}`} className="group block">
              <div className={`relative aspect-square bg-gradient-to-b ${bg} overflow-hidden mb-4`}>
                <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="font-serif text-xl md:text-2xl text-white leading-tight">
                    {name}
                  </h2>
                  <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gold mt-1">
                    {count} piezas
                  </p>
                </div>
              </div>
              <span className="font-nav text-[11px] tracking-[0.12em] uppercase text-vous-gray group-hover:text-vous-gold transition-colors border-b border-vous-gray-light/40 pb-0.5">
                Explorar {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
