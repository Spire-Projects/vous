import { Diamond, Users, Sparkles, Heart, BadgeCheck } from "lucide-react";

const VALUES = [
  { icon: Diamond, title: "EXCLUSIVIDAD", desc: "Piezas únicas, colecciones limitadas." },
  { icon: Users, title: "COMUNIDAD", desc: "Más que clientes, somos un equipo." },
  { icon: Sparkles, title: "ESTILO", desc: "Moda urbana y contemporánea." },
  { icon: Heart, title: "INCLUSIÓN", desc: "Moda para todos los cuerpos." },
  { icon: BadgeCheck, title: "CALIDAD", desc: "Cuidamos cada detalle del proceso." },
] as const;

export function ValuesSection() {
  return (
    <section className="bg-vous-warm-white border-y border-vous-gray-light/20 py-16">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex flex-wrap justify-between gap-8">
        {VALUES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-2 max-w-[150px] group"
          >
            <Icon
              size={28}
              strokeWidth={1.2}
              className="text-vous-gold mb-1 group-hover:scale-110 transition-transform duration-300"
            />
            <h3 className="font-nav text-[11px] font-semibold tracking-[0.2em] uppercase text-vous-soft-black">
              {title}
            </h3>
            <p className="font-sans text-[10px] text-vous-gray leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
