import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DepartmentLink } from "@/domain/entities/site-config.entity";
import { EMPTY_DEPT_LINK } from "./constants";

interface LocationsTabProps {
  departmentLinks: DepartmentLink[]; setDepartmentLinks: (v: DepartmentLink[]) => void;
  otherCountryLinks: DepartmentLink[]; setOtherCountryLinks: (v: DepartmentLink[]) => void;
}

export function LocationsTab({
  departmentLinks, setDepartmentLinks,
  otherCountryLinks, setOtherCountryLinks,
}: LocationsTabProps) {
  function updateDept(idx: number, field: keyof DepartmentLink, value: string) {
    const next = [...departmentLinks];
    next[idx] = { ...next[idx], [field]: value };
    setDepartmentLinks(next);
  }

  function addDept() {
    setDepartmentLinks([...departmentLinks, { ...EMPTY_DEPT_LINK }]);
  }

  function removeDept(idx: number) {
    setDepartmentLinks(departmentLinks.filter((_, i) => i !== idx));
  }

  function updateCountry(idx: number, field: keyof DepartmentLink, value: string) {
    const next = [...otherCountryLinks];
    next[idx] = { ...next[idx], [field]: value };
    setOtherCountryLinks(next);
  }

  function addCountry() {
    setOtherCountryLinks([...otherCountryLinks, { ...EMPTY_DEPT_LINK }]);
  }

  function removeCountry(idx: number) {
    setOtherCountryLinks(otherCountryLinks.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="font-serif text-xl text-vous-text">Links por Departamento</h2>
        <p className="font-sans text-sm text-vous-text-secondary">
          Puntos oficiales de compras por menor. Cada link GPS se mostrará en la página Nosotros.
        </p>
        <div className="space-y-3">
          {departmentLinks.map((dept, idx) => (
            <div key={idx} className="border border-vous-border p-3 space-y-2 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <span className="font-nav text-[11px] uppercase tracking-wide text-vous-text">Departamento {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeDept(idx)}
                  className="text-red-600 text-[11px] uppercase tracking-wide font-sans hover:underline shrink-0"
                >
                  Eliminar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label>Nombre</Label>
                  <Input value={dept.name} onChange={(e) => updateDept(idx, "name", e.target.value)} placeholder="Santa Cruz" />
                </div>
                <div className="space-y-1">
                  <Label>Google Maps URL</Label>
                  <Input value={dept.googleMapsUrl} onChange={(e) => updateDept(idx, "googleMapsUrl", e.target.value)} placeholder="https://maps.app.goo.gl/..." />
                </div>
                <div className="space-y-1">
                  <Label>TikTok URL (opcional)</Label>
                  <Input value={dept.tiktokUrl ?? ""} onChange={(e) => updateDept(idx, "tiktokUrl", e.target.value)} placeholder="https://vt.tiktok.com/..." />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline-gold" onClick={addDept}>
            + Agregar Departamento
          </Button>
        </div>
      </div>

      <div className="space-y-6 border-t border-white/40 pt-8">
        <h2 className="font-serif text-xl text-vous-text">Links Otros Países</h2>
        <p className="font-sans text-sm text-vous-text-secondary">
          Distribuidores oficiales y venta por mayor al exterior.
        </p>
        <div className="space-y-3">
          {otherCountryLinks.map((link, idx) => (
            <div key={idx} className="border border-vous-border p-3 space-y-2 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <span className="font-nav text-[11px] uppercase tracking-wide text-vous-text">País {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCountry(idx)}
                  className="text-red-600 text-[11px] uppercase tracking-wide font-sans hover:underline shrink-0"
                >
                  Eliminar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label>Nombre</Label>
                  <Input value={link.name} onChange={(e) => updateCountry(idx, "name", e.target.value)} placeholder="Argentina - Jujuy" />
                </div>
                <div className="space-y-1">
                  <Label>Google Maps URL</Label>
                  <Input value={link.googleMapsUrl} onChange={(e) => updateCountry(idx, "googleMapsUrl", e.target.value)} placeholder="https://maps.app.goo.gl/..." />
                </div>
                <div className="space-y-1">
                  <Label>TikTok URL (opcional)</Label>
                  <Input value={link.tiktokUrl ?? ""} onChange={(e) => updateCountry(idx, "tiktokUrl", e.target.value)} placeholder="https://vt.tiktok.com/..." />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline-gold" onClick={addCountry}>
            + Agregar País
          </Button>
        </div>
      </div>
    </div>
  );
}
