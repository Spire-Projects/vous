interface NosotrosHeroProps {
  storeName: string;
}

export function NosotrosHero({ storeName }: NosotrosHeroProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
      <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-4 block">
        Nuestra Esencia
      </span>
      <h1 className="font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.08] text-vous-soft-black mb-8 max-w-3xl">
        Redefiniendo el Lujo Urbano.
      </h1>
      <p className="font-sans text-base md:text-lg text-vous-gray max-w-xl leading-relaxed">
        {storeName} no es solo una marca; es un manifiesto de estilo de vida para quienes encuentran
        la belleza en la simplicidad arquitectónica y la sofisticación de la calle.
      </p>
    </section>
  );
}
