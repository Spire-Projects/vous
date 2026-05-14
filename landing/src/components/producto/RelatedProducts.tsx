import Link from 'next/link'

const RELATED = [
  { slug: 'pantalon-sastrero', name: 'Pantalón Sastrero', price: 'Bs. 420', bg: 'from-[#3d3d38] to-[#1a1a18]' },
  { slug: 'sueter-cachemira', name: 'Suéter de Cachemira', price: 'Bs. 550', bg: 'from-[#d4cfc6] to-[#b0a898]' },
  { slug: 'bufanda-estructural', name: 'Bufanda Estructural', price: 'Bs. 210', bg: 'from-[#b8b0a4] to-[#8a8278]' },
  { slug: 'botas-cuero', name: 'Botas de Cuero', price: 'Bs. 740', bg: 'from-[#6b5a3a] to-[#3d2e15]' },
]

export function RelatedProducts() {
  return (
    <section className="border-t border-vous-gray-light/40 pt-14 mt-14">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-vous-soft-black">
          Productos Relacionados
        </h2>
        <Link
          href="/catalogo"
          className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-vous-gray border-b border-vous-gray hover:text-vous-gold hover:border-vous-gold transition-colors pb-0.5"
        >
          Ver Todo
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {RELATED.map(({ slug, name, price, bg }) => (
          <Link key={slug} href={`/catalogo/${slug}`} className="group block">
            <div className={`aspect-[3/4] bg-gradient-to-b ${bg} mb-3`} />
            <h3 className="font-serif text-base text-vous-soft-black group-hover:text-vous-gold transition-colors">
              {name}
            </h3>
            <p className="font-sans text-sm text-vous-gray mt-1">{price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
