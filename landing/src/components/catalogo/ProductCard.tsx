import Link from 'next/link'

export interface Product {
  slug: string
  name: string
  category: string
  price: string
  badge?: string
  bg: string
}

export function ProductCard({ slug, name, category, price, badge, bg }: Product) {
  return (
    <Link href={`/catalogo/${slug}`} className="group block">
      <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-b ${bg} mb-4`}>
        {badge && (
          <span className="absolute top-3 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-vous-gold text-vous-soft-black px-2 py-1 z-10">
            {badge}
          </span>
        )}
        {/* Vista rápida aparece en hover */}
        <div className="absolute inset-x-0 bottom-0 bg-vous-soft-black/0 group-hover:bg-vous-soft-black/60 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2">
            Vista Rápida
          </span>
        </div>
      </div>
      <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1">
        {category}
      </p>
      <h3 className="font-serif text-lg text-vous-soft-black group-hover:text-vous-gold transition-colors leading-tight">
        {name}
      </h3>
      <p className="font-sans text-sm text-vous-gray mt-1">{price}</p>
    </Link>
  )
}
