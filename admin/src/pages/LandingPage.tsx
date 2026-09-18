import { useState } from "react";
import { Image, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { BannersTab } from "@/components/landing/BannersTab";
import { LandingSectionsTab } from "@/components/landing/LandingSectionsTab";

type LandingTab = "banners" | "sections";

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<LandingTab>("banners");

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)] space-y-6">
      <PageHeader
        category="Contenido"
        title="Landing & Portada"
        subtitle="Gestión de banners y secciones de productos destacados de la página principal."
      />

      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("banners")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "banners"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Image size={15} strokeWidth={2} />
          Banners
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "sections"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <LayoutGrid size={15} strokeWidth={2} />
          Secciones
        </button>
      </div>

      {activeTab === "banners" && <BannersTab />}
      {activeTab === "sections" && <LandingSectionsTab />}
    </div>
  );
}
