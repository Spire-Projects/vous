import { useState, useCallback, useEffect, useRef } from "react";
import { Save, Loader2, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { BoliviaMap } from "@/components/map/BoliviaMap";
import { DepartmentLinkEditor } from "@/components/map/DepartmentLinkEditor";
import { DEFAULT_DEPARTMENT_LINKS, DEFAULT_OTHER_COUNTRY_LINKS } from "@/data/map-defaults";
import type { DepartmentLink } from "@/domain/entities/site-config.entity";

export function MapaPage() {
  const { config, loading, saving, update } = useSiteConfig();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [localDeptLinks, setLocalDeptLinks] = useState<DepartmentLink[]>([]);
  const [localCountryLinks, setLocalCountryLinks] = useState<DepartmentLink[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (config && !initialized.current) {
      setLocalDeptLinks(config.departmentLinks?.length ? [...config.departmentLinks] : []);
      setLocalCountryLinks(config.otherCountryLinks?.length ? [...config.otherCountryLinks] : []);
      initialized.current = true;
    }
  }, [config]);

  const handleSelectDept = useCallback((deptId: string | null) => {
    setSelectedDept(deptId);
  }, []);

  function loadDefaults() {
    setLocalDeptLinks([...DEFAULT_DEPARTMENT_LINKS]);
    setLocalCountryLinks([...DEFAULT_OTHER_COUNTRY_LINKS]);
  }

  async function handleSave() {
    const input = {
      departmentLinks: localDeptLinks.filter((d) => d.name.trim() !== "" && (d.googleMapsUrl.trim() !== "" || (d.tiktokUrl ?? "").trim() !== "")),
      otherCountryLinks: localCountryLinks.filter((d) => d.name.trim() !== "" && (d.googleMapsUrl.trim() !== "" || (d.tiktokUrl ?? "").trim() !== "")),
    };
    await update(input);
  }

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <PageHeader title="Mapa de Puntos Oficiales" subtitle="Gestiona los puntos de venta y distribuidores en Bolivia." />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-vous-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <PageHeader
        title="Mapa de Puntos Oficiales"
        subtitle="Haz clic en un departamento para ver las tiendas. Todos los puntos están marcados en el mapa."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadDefaults} className="text-xs font-sans">
              <Download size={13} className="mr-1" />
              Cargar datos predefinidos
            </Button>
            <Button onClick={handleSave} disabled={saving} className="shrink-0">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2} />}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        }
      />

      {/* Mapa con panel de tiendas integrado */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-4" style={{ minHeight: 520 }}>
        <BoliviaMap
          selectedDept={selectedDept}
          onSelectDept={handleSelectDept}
          departmentLinks={localDeptLinks}
          otherCountryLinks={localCountryLinks}
        />
      </div>

      {/* Editor de links */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-4 sm:p-5">
        <h2 className="font-serif text-lg text-vous-text mb-4">Editar ubicaciones</h2>
        <DepartmentLinkEditor
          selectedDept={selectedDept}
          deptName={selectedDept ? ({
            "pando": "Pando", "la-paz": "La Paz", "beni": "Beni", "santa-cruz": "Santa Cruz",
            "cochabamba": "Cochabamba", "oruro": "Oruro", "potosi": "Potosí",
            "chuquisaca": "Chuquisaca", "tarija": "Tarija",
          }[selectedDept] ?? "") : ""}
          departmentLinks={localDeptLinks}
          otherCountryLinks={localCountryLinks}
          onChangeDeptLinks={setLocalDeptLinks}
          onChangeCountryLinks={setLocalCountryLinks}
        />
      </div>
    </div>
  );
}
