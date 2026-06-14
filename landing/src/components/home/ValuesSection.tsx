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
    <section className="bg-white py-8 md:py-10 border-y border-black/5">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 py-2">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center mb-1">
                <Icon size={16} strokeWidth={1.5} className="text-black/60" />
              </div>
              <h3 className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-black">
                {title}
              </h3>
              <p className="font-sans text-[11px] text-black/50 leading-snug hidden md:block max-w-[180px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
