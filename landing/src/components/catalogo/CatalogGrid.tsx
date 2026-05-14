import { ProductCard, type Product } from './ProductCard'

const PRODUCTS: Product[] = [
  { slug: 'sobretodo-lana-estructurado', name: 'Sobretodo de Lana Estructurado', category: 'Ropa de Abrigo', price: 'Bs. 890', bg: 'from-[#b8b0a4] to-[#8a8278]' },
  { slug: 'chaqueta-moto-esculpida', name: 'Chaqueta Moto Esculpida', category: 'Ropa de Abrigo', price: 'Bs. 1.250', badge: 'NUEVO', bg: 'from-[#2a2015] to-[#1a1a18]' },
  { slug: 'cuello-tortuga-cachemira', name: 'Cuello de Tortuga de Cachemira', category: 'Tejidos', price: 'Bs. 420', bg: 'from-[#d4cfc6] to-[#b0a898]' },
  { slug: 'pantalon-arquitectonico', name: 'Pantalón Arquitectónico', category: 'Pantalones', price: 'Bs. 340', bg: 'from-[#3d3d38] to-[#1a1a18]' },
  { slug: 'camisa-popelina-esencial', name: 'Camisa de Popelina Esencial', category: 'Camisas', price: 'Bs. 210', bg: 'from-[#fdfaf5] to-[#e8e2d8]' },
  { slug: 'bota-cuero-urbana', name: 'Bota de Cuero Urbana', category: 'Calzado', price: 'Bs. 580', bg: 'from-[#6b5a3a] to-[#3d2e15]' },
]

export function CatalogGrid() {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-8">
        <p className="font-sans text-sm text-vous-gray">
          Mostrando <span className="text-vous-soft-black font-medium">6</span> de 42 productos
        </p>
        <select className="font-sans text-sm border border-vous-gray-light text-vous-gray bg-transparent px-3 py-1.5 outline-none focus:border-vous-gold">
          <option>Más Relevantes</option>
          <option>Precio: Menor a Mayor</option>
          <option>Precio: Mayor a Menor</option>
          <option>Nuevas Llegadas</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} {...p} />
        ))}
      </div>

      <div className="mt-14 text-center">
        <button className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-10 py-3 hover:bg-vous-soft-black hover:text-white transition-colors duration-200">
          Cargar Más
        </button>
      </div>
    </div>
  )
}
