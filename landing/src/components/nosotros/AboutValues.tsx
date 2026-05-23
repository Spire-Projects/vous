import { Diamond, ShieldCheck, Users } from "lucide-react";

const PILARS = [
  {
    icon: Diamond,
    title: "Exclusividad",
    text: "Producciones limitadas y diseños únicos que garantizan que cada prenda sea una pieza de colección personal.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad",
    text: "Seleccionamos únicamente los materiales más nobles, cuidando cada detalle del proceso de confección.",
  },
  {
    icon: Users,
    title: "Comunidad",
    text: "Creamos espacios de diálogo para creativos, artistas y apasionados de la moda que comparten nuestra visión urbana.",
  },
] as const;

export function AboutValues() {
  return (
    <section className="bg-vous-cream">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="mb-14 text-center">
          <span className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase block mb-3">
            FILOSOFÍA
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black">
            Pilares de Marca
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILARS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="p-8 border border-vous-gray-light/40 bg-white flex flex-col items-center text-center"
            >
              <Icon size={36} strokeWidth={1.2} className="text-vous-soft-black mb-6" />
              <h3 className="font-serif text-2xl md:text-[28px] font-medium text-vous-soft-black mb-4">
                {title}
              </h3>
              <p className="font-sans text-sm text-vous-gray leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
