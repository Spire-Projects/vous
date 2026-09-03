const PILLARS = [
  {
    label: "Misión",
    text: "Crear una experiencia de moda auténtica, exclusiva y cercana, ofreciendo prendas que permitan a cada persona expresar su estilo con seguridad, comodidad y personalidad.",
  },
  {
    label: "Visión",
    text: "Convertirnos en una marca referente de moda urbana y contemporánea en Latinoamérica, destacando por nuestra exclusividad, innovación e inclusión de tallas.",
  },
  {
    label: "Propósito",
    text: "Inspirar a las personas a ser su mejor versión a través de la moda, promoviendo la autenticidad, la libertad y la confianza en quienes son realmente.",
  },
] as const;

export function MisionSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">
          {/* Left */}
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.25em] text-black uppercase mb-3">
              Sobre VOUS
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-black leading-[1.15]">
              Quiénes
              <br />
              Somos
            </h2>
            <div className="h-px w-12 bg-black mt-8" />
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map(({ label, text }) => (
              <div key={label}>
                <h3 className="font-sans text-[11px] font-semibold tracking-[0.2em] text-black uppercase mb-4">
                  {label}
                </h3>
                <p className="font-sans text-sm text-black/50 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
