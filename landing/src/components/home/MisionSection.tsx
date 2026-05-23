const PILLARS = [
  {
    label: "MISIÓN",
    text: "Crear una experiencia de moda auténtica, exclusiva y cercana, ofreciendo prendas que permitan a cada persona expresar su estilo con seguridad, comodidad y personalidad.",
  },
  {
    label: "VISIÓN",
    text: "Convertirnos en una marca referente de moda urbana y contemporánea en Latinoamérica, destacando por nuestra exclusividad, innovación e inclusión de tallas.",
  },
  {
    label: "PROPÓSITO",
    text: "Inspirar a las personas a ser su mejor versión a través de la moda, promoviendo la autenticidad, la libertad y la confianza en quienes son realmente.",
  },
] as const;

export function MisionSection() {
  return (
    <section className="bg-vous-cream py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative z-10">
        {PILLARS.map(({ label, text }, idx) => (
          <div
            key={label}
            className={`space-y-5 text-center md:text-left ${
              idx === 1
                ? "md:border-x md:border-vous-gray-light/30 py-8 md:py-0 md:px-10"
                : ""
            }`}
          >
            <h3 className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase">
              {label}
            </h3>
            <p className="font-sans text-sm text-vous-gray leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Decorative V */}
      <div className="absolute -right-20 top-0 font-serif text-[400px] text-vous-soft-black opacity-[0.04] select-none pointer-events-none leading-none">
        V
      </div>
    </section>
  );
}
