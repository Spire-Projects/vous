import { useState } from "react";
import { Image, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { BannersTab } from "@/components/landing/BannersTab";
import { LandingSectionsTab } from "@/components/landing/LandingSectionsTab";

type LandingTab = "banners" | "sections";

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<LandingTab>("banners");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Landing"
        subtitle="Gestión de banners y secciones de productos destacados de la página principal."
      />

      <div className="flex gap-1 border-b border-white/40 pb-1">
        <button
          onClick={() => setActiveTab("banners")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "banners"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Image size={14} strokeWidth={1.5} />
          Banners
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "sections"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <LayoutGrid size={14} strokeWidth={1.5} />
          Secciones
        </button>
      </div>

      {activeTab === "banners" && <BannersTab />}
      {activeTab === "sections" && <LandingSectionsTab />}
    </div>
  );
}
