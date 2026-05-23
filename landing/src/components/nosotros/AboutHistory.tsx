export function AboutHistory() {
  return (
    <section className="bg-vous-warm-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Image Placeholder */}
          <div className="lg:col-span-6 relative aspect-[3/4] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4cfc6] via-[#b8b0a4] to-[#8a8278]" />
            <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="font-nav text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase">
                Editorial VOUS — 2026
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black mb-8">
              Nuestra Historia
            </h2>
            <div className="space-y-5 font-sans text-sm text-vous-gray leading-relaxed">
              <p>
                Nacimos en el corazón de la ciudad, inspirados por la intersección entre la moda
                contemporánea y el ritmo incesante de la urbe. Lo que comenzó como un pequeño estudio
                de diseño experimental se ha transformado en un referente del estilo urbano premium.
              </p>
              <p>
                Cada pieza de VOUS es el resultado de un proceso meticuloso donde la artesanía
                tradicional se encuentra con una visión vanguardista. No creemos en temporadas, sino en
                piezas eternas que cuentan una historia de confianza y elegancia discreta.
              </p>
              <p>
                Hoy, VOUS representa una comunidad global de visionarios que valoran la autenticidad
                por encima de las tendencias efímeras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
