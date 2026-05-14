import Link from 'next/link'

const POSTS = [
  {
    slug: 'arquitectura-vestimenta',
    category: 'Editorial',
    title: 'La Arquitectura como Lenguaje de la Vestimenta',
    excerpt:
      'Exploramos cómo la precisión estructural del diseño arquitectónico ha influenciado la nueva colección de VOUS, donde cada prenda es un estudio de forma y función.',
    date: '8 Mayo, 2025',
    readTime: '5 min',
    bg: 'from-[#1a1a18] to-[#2a2015]',
  },
  {
    slug: 'lujo-sin-esfuerzo',
    category: 'Estilo',
    title: 'El Lujo Sin Esfuerzo: Minimalismo Urbano para el Día a Día',
    excerpt:
      'Una guía para construir un guardarropa esencial con piezas que transitan del día a la noche con elegancia discreta.',
    date: '1 Mayo, 2025',
    readTime: '4 min',
    bg: 'from-[#3d3d38] to-[#1a1a18]',
  },
  {
    slug: 'materiales-sostenibles',
    category: 'Proceso',
    title: 'Lana Orgánica y Algodón Pima: Nuestro Compromiso con los Materiales',
    excerpt:
      'Detrás de cada prenda de VOUS hay una selección rigurosa de materiales. Conoce de dónde vienen y por qué importan.',
    date: '22 Abril, 2025',
    readTime: '6 min',
    bg: 'from-[#b8b0a4] to-[#8a8278]',
  },
  {
    slug: 'silueta-contemporanea',
    category: 'Tendencias',
    title: 'La Silueta Contemporánea: Cómo Viste Bolivia en 2025',
    excerpt:
      'Un análisis de cómo la moda urbana latinoamericana está redefiniendo los códigos de vestimenta en las ciudades andinas.',
    date: '14 Abril, 2025',
    readTime: '7 min',
    bg: 'from-[#6b5a3a] to-[#3d2e15]',
  },
]

export default function RevistaPage() {
  return (
    <div className="bg-vous-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-vous-soft-black py-14 md:py-20 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-3">
            Editorial
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
            Revista VOUS
          </h1>
          <p className="font-sans text-sm text-white/60 max-w-md leading-relaxed">
            Historias, tendencias y el proceso detrás de cada colección.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-14 md:py-20">
        {/* Featured post */}
        <Link
          href={`/revista/${POSTS[0].slug}`}
          className="group md:flex gap-10 mb-16 block"
        >
          <div
            className={`md:w-1/2 aspect-video bg-gradient-to-br ${POSTS[0].bg} shrink-0 mb-6 md:mb-0`}
          />
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-gold mb-2">
              {POSTS[0].category}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-vous-soft-black leading-snug mb-4 group-hover:text-vous-gold transition-colors">
              {POSTS[0].title}
            </h2>
            <p className="font-sans text-sm text-vous-gray leading-relaxed mb-6">
              {POSTS[0].excerpt}
            </p>
            <div className="flex items-center gap-4 font-nav text-[10px] tracking-[0.12em] uppercase text-vous-gray">
              <span>{POSTS[0].date}</span>
              <span className="text-vous-gray-light">·</span>
              <span>{POSTS[0].readTime} lectura</span>
            </div>
          </div>
        </Link>

        {/* Rest */}
        <div className="border-t border-vous-gray-light/40 pt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {POSTS.slice(1).map(({ slug, category, title, excerpt, date, readTime, bg }) => (
              <Link key={slug} href={`/revista/${slug}`} className="group block">
                <div className={`aspect-video bg-gradient-to-br ${bg} mb-4`} />
                <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-gold mb-2">
                  {category}
                </p>
                <h3 className="font-serif text-lg text-vous-soft-black group-hover:text-vous-gold transition-colors leading-snug mb-3">
                  {title}
                </h3>
                <p className="font-sans text-xs text-vous-gray leading-relaxed mb-4 line-clamp-2">
                  {excerpt}
                </p>
                <div className="flex items-center gap-3 font-nav text-[10px] tracking-[0.12em] uppercase text-vous-gray">
                  <span>{date}</span>
                  <span className="text-vous-gray-light">·</span>
                  <span>{readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
