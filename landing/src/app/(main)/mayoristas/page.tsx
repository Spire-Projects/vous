import { WholesaleForm } from "@/components/mayoristas/WholesaleForm";
import { CheckCircle } from "lucide-react";

const FEATURES = [
  {
    title: "Inventario Seleccionado",
    desc: "Acceso a piezas de temporada antes del lanzamiento público.",
  },
  { title: "Soporte Personalizado", desc: "Un asesor dedicado para cada cuenta mayorista." },
  { title: "Presencia Global", desc: "Red de distribución en mercados premium de Latinoamérica." },
];

const REQUESTS = [
  {
    ref: "#VQ-9821",
    status: "REVISIÓN PENDIENTE",
    statusStyle: "bg-vous-gold/10 text-vous-gold",
    desc: "Tus credenciales están siendo verificadas por nuestro equipo.",
  },
  {
    ref: "#VQ-7742",
    status: "DISTRIBUIDOR APROBADO",
    statusStyle: "bg-green-50 text-green-700",
    desc: "Autorizado. Acceso al catálogo digital habilitado.",
  },
  {
    ref: "#VQ-1205",
    status: "NO ELEGIBLE",
    statusStyle: "bg-red-50 text-red-600",
    desc: "La solicitud no cumple con nuestros estándares actuales.",
  },
];

export default function MayoristasPage() {
  return (
    <div className="bg-vous-warm-white min-h-screen">
      {/* Hero */}
      <div className="bg-vous-soft-black py-20 md:py-28 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-3">
            Programa Mayorista VOUS
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-5 max-w-2xl leading-tight">
            Excelencia en Alianzas
          </h1>
          <p className="font-sans text-sm text-white/60 max-w-lg leading-relaxed">
            Únete al programa exclusivo de distribución mayorista de VOUS y accede a condiciones
            preferenciales, inventario curado y soporte editorial personalizado.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {FEATURES.map(({ title, desc }) => (
            <div key={title} className="bg-vous-cream p-8">
              <div className="w-10 h-10 bg-vous-soft-black flex items-center justify-center mb-5">
                <CheckCircle size={18} className="text-vous-gold" />
              </div>
              <h3 className="font-serif text-xl text-vous-soft-black mb-2">{title}</h3>
              <p className="font-sans text-sm text-vous-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Form */}
          <div className="flex-1 min-w-0">
            <WholesaleForm />
          </div>

          {/* Estado de solicitudes */}
          <div className="lg:w-80 shrink-0 space-y-5">
            <h2 className="font-serif text-xl text-vous-soft-black">Estado de Solicitudes</h2>
            {REQUESTS.map(({ ref, status, statusStyle, desc }) => (
              <div key={ref} className="border border-vous-gray-light/40 p-5 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray">
                    Ref {ref}
                  </p>
                  <span
                    className={`font-nav text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${statusStyle}`}
                  >
                    {status}
                  </span>
                </div>
                <p className="font-sans text-xs text-vous-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
