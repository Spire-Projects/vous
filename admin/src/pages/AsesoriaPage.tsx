import { useState } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AsesoriaModaTab } from "@/components/asesoria/AsesoriaModaTab";
import { GuiasTab } from "@/components/asesoria/GuiasTab";

type AsesoriaTab = "moda" | "guias";

export function AsesoriaPage() {
  const [activeTab, setActiveTab] = useState<AsesoriaTab>("moda");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Asesoría"
        subtitle="Asesoría de moda y guías de estilo para clientes."
      />

      <div className="flex gap-1 border-b border-white/40 pb-1">
        <button
          onClick={() => setActiveTab("moda")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "moda"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Lightbulb size={14} strokeWidth={1.5} />
          Asesoría de Moda
        </button>
        <button
          onClick={() => setActiveTab("guias")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "guias"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Sparkles size={14} strokeWidth={1.5} />
          Guías de Estilo
        </button>
      </div>

      {activeTab === "moda" && <AsesoriaModaTab />}
      {activeTab === "guias" && <GuiasTab />}
    </div>
  );
}
