import { Diamond, Users, Sparkles, Heart, BadgeCheck } from "lucide-react";

const VALUES = [
  {
    icon: Diamond,
    title: "Exclusividad",
    desc: "Piezas únicas, colecciones limitadas.",
  },
  {
    icon: Users,
    title: "Comunidad",
    desc: "Más que clientes, somos un equipo.",
  },
  {
    icon: Sparkles,
    title: "Estilo",
    desc: "Moda urbana y contemporánea.",
  },
  {
    icon: Heart,
    title: "Inclusión",
    desc: "Moda para todos los cuerpos.",
  },
  {
    icon: BadgeCheck,
    title: "Calidad",
    desc: "Cuidamos cada detalle del proceso.",
  },
] as const;

export function ValuesSection() {
  return (
    <section className="bg-vous-cream border-y border-vous-gray-light/40 py-12">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2.5 py-4">
              <Icon size={20} strokeWidth={1.5} className="text-vous-gold" />
              <h3 className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-vous-soft-black">
                {title}
              </h3>
              <p className="font-sans text-xs text-vous-gray leading-snug hidden md:block">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
