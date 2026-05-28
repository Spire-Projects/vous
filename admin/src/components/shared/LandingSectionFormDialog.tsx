import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  LandingSection,
  LandingSectionType,
  CreateLandingSectionInput,
} from "@/domain/entities/landing-section.entity";
import { LANDING_SECTION_TYPE_LABELS } from "@/domain/entities/landing-section.entity";

interface LandingSectionFormDialogProps {
  open: boolean;
  section: LandingSection | null;
  nextOrder: number;
  onClose: () => void;
  onSave: (data: CreateLandingSectionInput) => Promise<void>;
}

const SECTION_TYPES: LandingSectionType[] = [
  "featured",
  "new_arrivals",
  "discounted",
  "special_collection",
  "bestseller",
];

export function LandingSectionFormDialog({
  open,
  section,
  nextOrder,
  onClose,
  onSave,
}: LandingSectionFormDialogProps) {
  const [name, setName] = useState(section?.name ?? "");
  const [type, setType] = useState<LandingSectionType>(section?.type ?? "featured");
  const [active, setActive] = useState(section?.active ?? true);
  const [order, setOrder] = useState(section?.order ?? nextOrder);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        type,
        active,
        order,
        productIds: section?.productIds ?? [],
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-widest">
            {section ? "Editar Sección" : "Nueva Sección"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label className="font-nav text-[11px] uppercase tracking-wider">
              Nombre de la sección
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Piezas Destacadas"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-nav text-[11px] uppercase tracking-wider">Tipo</Label>
            <div className="grid grid-cols-1 gap-2">
              {SECTION_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex items-center gap-2 px-3 py-2 border text-left text-[12px] font-sans transition-colors ${
                    type === t
                      ? "border-vous-gold bg-vous-gold/10 text-vous-black"
                      : "border-vous-border text-vous-gray hover:border-vous-gold/50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${type === t ? "bg-vous-gold" : "bg-vous-gray-light"}`}
                  />
                  {LANDING_SECTION_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="active-check"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="accent-vous-gold"
            />
            <Label htmlFor="active-check" className="font-nav text-[11px] uppercase tracking-wider cursor-pointer">
              Activa
            </Label>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Guardando…" : section ? "Guardar cambios" : "Crear sección"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
