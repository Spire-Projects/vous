import { useState } from "react";
import { Plus, Trash2, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DepartmentLink } from "@/domain/entities/site-config.entity";

interface DepartmentLinkEditorProps {
  selectedDept: string | null;
  deptName: string;
  departmentLinks: DepartmentLink[];
  otherCountryLinks: DepartmentLink[];
  onChangeDeptLinks: (links: DepartmentLink[]) => void;
  onChangeCountryLinks: (links: DepartmentLink[]) => void;
}

const EMPTY_LINK: DepartmentLink = { name: "", googleMapsUrl: "", tiktokUrl: "" };

function LinkRow({
  link,
  idx,
  onChange,
  onRemove,
  onChangeNumber,
}: {
  link: DepartmentLink;
  idx: number;
  onChange: (idx: number, field: keyof DepartmentLink, value: string) => void;
  onChangeNumber: (idx: number, field: "lat" | "lng", value: number | undefined) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div className="border border-vous-border p-3 space-y-2 rounded-xl bg-white/60">
      <div className="flex items-center justify-between gap-2">
        <span className="font-nav text-[10px] uppercase tracking-wide text-vous-text-secondary">
          Punto {idx + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="text-vous-accent-red text-[10px] uppercase tracking-wide font-sans hover:underline shrink-0 flex items-center gap-1"
        >
          <Trash2 size={11} /> Eliminar
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div className="space-y-1">
          <Label className="text-[11px]">Nombre del punto</Label>
          <Input
            value={link.name}
            onChange={(e) => onChange(idx, "name", e.target.value)}
            placeholder="Ej: Showroom Santa Cruz"
            className="text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">URL Google Maps</Label>
          <Input
            value={link.googleMapsUrl}
            onChange={(e) => onChange(idx, "googleMapsUrl", e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            className="text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">URL TikTok (opcional)</Label>
          <Input
            value={link.tiktokUrl ?? ""}
            onChange={(e) => onChange(idx, "tiktokUrl", e.target.value)}
            placeholder="https://vt.tiktok.com/..."
            className="text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[11px]">Latitud</Label>
            <Input
              type="number"
              step="any"
              value={link.lat ?? ""}
              onChange={(e) => onChangeNumber(idx, "lat", e.target.value === "" ? undefined : parseFloat(e.target.value))}
              placeholder="-17.78"
              className="text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Longitud</Label>
            <Input
              type="number"
              step="any"
              value={link.lng ?? ""}
              onChange={(e) => onChangeNumber(idx, "lng", e.target.value === "" ? undefined : parseFloat(e.target.value))}
              placeholder="-63.18"
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DepartmentLinkEditor({
  selectedDept,
  deptName,
  departmentLinks,
  otherCountryLinks,
  onChangeDeptLinks,
  onChangeCountryLinks,
}: DepartmentLinkEditorProps) {
  const [activeTab, setActiveTab] = useState<"national" | "international">("national");

  const deptLinks = selectedDept
    ? departmentLinks.filter(
        (link) => link.name.toLowerCase().trim() === deptName.toLowerCase().trim()
      )
    : [];

  function getGlobalIdx(idx: number): number | null {
    const indices = departmentLinks
      .map((link, i) => (link.name.toLowerCase().trim() === deptName.toLowerCase().trim() ? i : -1))
      .filter((i) => i !== -1);
    return indices[idx] ?? null;
  }

  function updateLink(idx: number, field: keyof DepartmentLink, value: string) {
    const gi = getGlobalIdx(idx);
    if (gi === null) return;
    const next = [...departmentLinks];
    next[gi] = { ...next[gi], [field]: value };
    onChangeDeptLinks(next);
  }

  function updateLinkNumber(idx: number, field: "lat" | "lng", value: number | undefined) {
    const gi = getGlobalIdx(idx);
    if (gi === null) return;
    const next = [...departmentLinks];
    next[gi] = { ...next[gi], [field]: value };
    onChangeDeptLinks(next);
  }

  function addDeptLink() {
    const newLink = { ...EMPTY_LINK, name: deptName };
    onChangeDeptLinks([...departmentLinks, newLink]);
  }

  function removeDeptLink(idx: number) {
    const remaining = departmentLinks.filter(
      (link) => link.name.toLowerCase().trim() !== deptName.toLowerCase().trim()
    );
    const targetLinks = deptLinks.filter((_, i) => i !== idx);
    onChangeDeptLinks([...remaining, ...targetLinks]);
  }

  function updateCountryLink(idx: number, field: keyof DepartmentLink, value: string) {
    const next = [...otherCountryLinks];
    next[idx] = { ...next[idx], [field]: value };
    onChangeCountryLinks(next);
  }

  function updateCountryLinkNumber(idx: number, field: "lat" | "lng", value: number | undefined) {
    const next = [...otherCountryLinks];
    next[idx] = { ...next[idx], [field]: value };
    onChangeCountryLinks(next);
  }

  function addCountryLink() {
    onChangeCountryLinks([...otherCountryLinks, { ...EMPTY_LINK }]);
  }

  function removeCountryLink(idx: number) {
    onChangeCountryLinks(otherCountryLinks.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-0.5 border-b border-vous-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("national")}
          className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-nav tracking-wide rounded-t-lg transition-colors border-b-2 -mb-[9px] ${
            activeTab === "national"
              ? "border-vous-gold text-vous-gold font-semibold"
              : "border-transparent text-vous-text-secondary hover:text-vous-text"
          }`}
        >
          <MapPin size={13} strokeWidth={1.5} />
          Puntos Nacionales
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("international")}
          className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-nav tracking-wide rounded-t-lg transition-colors border-b-2 -mb-[9px] ${
            activeTab === "international"
              ? "border-vous-gold text-vous-gold font-semibold"
              : "border-transparent text-vous-text-secondary hover:text-vous-text"
          }`}
        >
          <Globe size={13} strokeWidth={1.5} />
          Otros Países
        </button>
      </div>

      {activeTab === "national" && (
        <div className="space-y-3">
          {selectedDept ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-vous-text">{deptName}</h3>
                <span className="font-sans text-[11px] text-vous-text-secondary">
                  {deptLinks.length} punto{deptLinks.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {deptLinks.map((link, idx) => (
                  <LinkRow
                    key={`dept-${idx}`}
                    link={link}
                    idx={idx}
                    onChange={updateLink}
                    onChangeNumber={updateLinkNumber}
                    onRemove={removeDeptLink}
                  />
                ))}
                {deptLinks.length === 0 && (
                  <p className="text-xs text-vous-text-muted text-center py-6 font-sans">
                    No hay puntos configurados para este departamento. Agrega uno nuevo.
                  </p>
                )}
              </div>
              <Button type="button" variant="outline-gold" size="sm" onClick={addDeptLink} className="w-full text-xs">
                <Plus size={13} /> Agregar punto en {deptName}
              </Button>
            </>
          ) : (
            <div className="text-center py-10">
              <MapPin size={32} className="mx-auto text-vous-text-muted mb-3" strokeWidth={1} />
              <p className="font-serif text-vous-text-secondary text-sm mb-1">
                Selecciona un departamento
              </p>
              <p className="font-sans text-[11px] text-vous-text-muted">
                Haz clic en un departamento del mapa para ver y gestionar sus puntos oficiales.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "international" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-vous-text">Distribuidores Exterior</h3>
            <span className="font-sans text-[11px] text-vous-text-secondary">
              {otherCountryLinks.length} distribuidor{otherCountryLinks.length !== 1 ? "es" : ""}
            </span>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {otherCountryLinks.map((link, idx) => (
              <LinkRow
                key={`intl-${idx}`}
                link={link}
                idx={idx}
                onChange={updateCountryLink}
                onChangeNumber={updateCountryLinkNumber}
                onRemove={removeCountryLink}
              />
            ))}
            {otherCountryLinks.length === 0 && (
              <p className="text-xs text-vous-text-muted text-center py-6 font-sans">
                No hay distribuidores internacionales configurados.
              </p>
            )}
          </div>
          <Button type="button" variant="outline-gold" size="sm" onClick={addCountryLink} className="w-full text-xs">
            <Plus size={13} /> Agregar distribuidor internacional
          </Button>
        </div>
      )}
    </div>
  );
}
