import { Diamond, Users, BadgeCheck } from "lucide-react";

const VALUES = [
  {
    icon: Diamond,
    title: "Exclusividad",
    desc: "Producciones limitadas y diseños únicos que garantizan que cada prenda sea una pieza de colección personal.",
  },
  {
    icon: BadgeCheck,
    title: "Calidad",
    desc: "Seleccionamos únicamente los materiales más nobles, desde sedas italianas hasta cueros tratados artesanalmente.",
  },
  {
    icon: Users,
    title: "Comunidad",
    desc: "Creamos espacios de diálogo para creativos, artistas y apasionados de la moda que comparten nuestra visión.",
  },
] as const;

export function NosotrosPilares() {
  return (
    <section className="bg-white border-y border-black/10 py-12 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="mb-14 text-center">
          <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-3 block">
            Filosofía
          </span>
          <h2 className="font-serif text-[28px] md:text-[42px] text-black">
            Pilares de Marca
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-black/10 p-8 md:p-10 flex flex-col items-center text-center"
            >
              <Icon size={32} strokeWidth={1.2} className="text-black mb-6" />
              <h3 className="font-serif text-2xl text-black mb-4">{title}</h3>
              <p className="font-sans text-sm text-black/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
