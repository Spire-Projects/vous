import Image from "next/image";

interface NosotrosHistoriaProps {
  storeName: string;
}

export function NosotrosHistoria({ storeName }: NosotrosHistoriaProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
      <div className="grid grid-cols-12 gap-6 md:gap-8 items-center">
        <div className="col-span-12 md:col-span-6 relative aspect-[3/4] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-white" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZBNb7diba5FyrcMnwT-70C7DIgk-L_6m77ZqvhVuXu2fBfaps1pwjvZ7xLzUtQucYb74AL1VJGk2jThYTgArHZiOOC7tCfPl2f3LB4ImKC44ixtz2VavPsDjdXCvKsFvHNN-yB_g-6gv_DDJzCRucfSEvz-rFUyQ8HEPmdsQSyCthysQ-pBtvfNDAfyHdnOXZKMFteanZj3xIbaCk99HrHtyGoQNEnw3I5Wi3xWwtW7UuQ2k9UDlKRUCHm7e94RE27QnJHCz_K2w"
            alt="VOUS - Moda urbana editorial"
            fill
            className="object-cover hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="col-span-12 md:col-span-5 md:col-start-8 mt-10 md:mt-0">
          <h2 className="font-serif text-[28px] md:text-4xl text-black mb-8">
            Nuestra Historia
          </h2>
          <div className="space-y-5 font-sans text-sm md:text-base text-black/50 leading-relaxed">
            <p>
              Nacimos en el corazón de la metrópolis, inspirados por la intersección entre la alta
              costura y el ritmo incesante de la ciudad. Lo que comenzó como un pequeño estudio de
              diseño experimental se ha transformado en un referente del lujo contemporáneo.
            </p>
            <p>
              Cada pieza de {storeName} es el resultado de un proceso meticuloso donde la artesanía
              tradicional se encuentra con una visión vanguardista. No creemos en temporadas, sino
              en piezas eternas que cuentan una historia de confianza y elegancia discreta.
            </p>
            <p>
              Hoy, {storeName} representa una comunidad global de visionarios que valoran la
              autenticidad por encima de las tendencias efímeras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
