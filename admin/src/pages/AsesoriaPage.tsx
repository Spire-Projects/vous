import { useState } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AsesoriaModaTab } from "@/components/asesoria/AsesoriaModaTab";
import { GuiasTab } from "@/components/asesoria/GuiasTab";

type AsesoriaTab = "moda" | "guias";

export function AsesoriaPage() {
  const [activeTab, setActiveTab] = useState<AsesoriaTab>("moda");

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)] space-y-6">
      <PageHeader
        category="Personas"
        title="Asesoría & Estilo"
        subtitle="Asesoría de moda y guías de estilo para clientes."
      />

      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("moda")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "moda"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Lightbulb size={15} strokeWidth={2} />
          Asesoría de Moda
        </button>
        <button
          onClick={() => setActiveTab("guias")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "guias"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles size={15} strokeWidth={2} />
          Guías de Estilo
        </button>
      </div>

      {activeTab === "moda" && <AsesoriaModaTab />}
      {activeTab === "guias" && <GuiasTab />}
    </div>
  );
}
