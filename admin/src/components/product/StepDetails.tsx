import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttributeEditor } from "@/components/shared/AttributeEditor";

interface StepDetailsProps {
  materials: string[];
  attributes: Record<string, string>;
  badge: string;
  configMaterials: { id: string; name: string; isActive: boolean }[];
  configAttributes: { id: string; name: string; label: string; isActive: boolean }[];
  configBadges: { id: string; name: string; color: string; isActive: boolean }[];
  onMaterialsChange: (v: string[]) => void;
  onAttributesChange: (v: Record<string, string>) => void;
  onBadgeChange: (v: string) => void;
}

export function StepDetails({
  materials,
  attributes,
  badge,
  configMaterials,
  configAttributes,
  configBadges,
  onMaterialsChange,
  onAttributesChange,
  onBadgeChange,
}: StepDetailsProps) {
  const [customMaterial, setCustomMaterial] = useState("");

  const activeMaterials = configMaterials.filter((m) => m.isActive);
  const activeBadges = configBadges.filter((b) => b.isActive);

  function toggleMaterial(name: string) {
    if (materials.includes(name)) {
      onMaterialsChange(materials.filter((m) => m !== name));
    } else {
      onMaterialsChange([...materials, name]);
    }
  }

  function addCustomMaterial() {
    const val = customMaterial.trim();
    if (!val || materials.includes(val)) return;
    onMaterialsChange([...materials, val]);
    setCustomMaterial("");
  }

  return (
    <section className="space-y-4">
      <p className="font-nav text-[10px] uppercase tracking-widest text-vous-text-secondary border-b border-white/40 pb-1 mb-1">
        Caracteristicas de la prenda
      </p>
      <p className="text-[11px] text-vous-text-secondary leading-relaxed mb-2">
        Estos detalles ayudan al cliente a conocer mejor el producto. Selecciona de la configuracion global o agrega valores personalizados.
      </p>

      {/* Materials */}
      <div className="space-y-2">
        <Label>Materiales</Label>
        {activeMaterials.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeMaterials.map((m) => {
              const selected = materials.includes(m.name);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMaterial(m.name)}
                  className={`px-3 py-1.5 font-sans text-xs border rounded-lg transition-colors ${
                    selected
                      ? "bg-black text-white border-black"
                      : "border-black/10 text-black/60 hover:border-black/30 hover:text-black"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {materials
            .filter((m) => !activeMaterials.some((c) => c.name === m))
            .map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-nav uppercase tracking-wide bg-white/90 border border-vous-border"
              >
                {m}
                <button type="button" onClick={() => toggleMaterial(m)} className="text-vous-text-secondary hover:text-vous-text ml-0.5">
                  <X size={11} />
                </button>
              </span>
            ))}
        </div>
        <div className="flex gap-1.5">
          <Input
            value={customMaterial}
            onChange={(e) => setCustomMaterial(e.target.value)}
            placeholder="Material personalizado..."
            className="h-8 text-[11px] w-48"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomMaterial();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={addCustomMaterial}>
            <Plus size={12} /> Agregar
          </Button>
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-1">
        <Label>Atributos (corte, tela, pretina, largo...)</Label>
        <AttributeEditor value={attributes} onChange={onAttributesChange} />
        {configAttributes.filter((a) => a.isActive).length > 0 && (
          <p className="text-[10px] text-vous-text-secondary mt-1">
            Atributos configurados: {configAttributes.filter((a) => a.isActive).map((a) => a.label).join(", ")}
          </p>
        )}
      </div>

      {/* Badge */}
      <div className="space-y-1">
        <Label>Etiqueta especial (Badge)</Label>
        {activeBadges.length > 0 ? (
          <Select value={badge || "__none__"} onValueChange={(v) => onBadgeChange(v === "__none__" ? "" : v)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Seleccionar badge..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Ninguno</SelectItem>
              {activeBadges.map((b) => (
                <SelectItem key={b.id} value={b.name}>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: b.color }}
                    />
                    {b.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={badge}
            onChange={(e) => onBadgeChange(e.target.value)}
            placeholder="Nuevo, Sale, Exclusivo..."
          />
        )}
        <p className="text-[10px] text-vous-text-secondary mt-1">Aparece como una etiqueta sobre la foto del producto.</p>
      </div>
    </section>
  );
}
