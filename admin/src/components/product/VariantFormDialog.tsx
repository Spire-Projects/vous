import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductVariant, CreateVariantInput } from "@/domain/entities/product.entity";

interface VariantFormDialogProps {
  open: boolean;
  variant: ProductVariant | null;
  onClose: () => void;
  onSave: (data: CreateVariantInput) => Promise<void>;
}

export function VariantFormDialog({ open, variant, onClose, onSave }: VariantFormDialogProps) {
  const [size, setSize] = useState(variant?.size ?? "");
  const [color, setColor] = useState(variant?.color ?? "");
  const [colorHex, setColorHex] = useState(variant?.colorHex ?? "#000000");
  const [sku, setSku] = useState(variant?.sku ?? "");
  const [stock, setStock] = useState(variant?.stock ?? 0);
  const [isActive, setIsActive] = useState(variant?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!size.trim() && !color.trim()) return;
    setSaving(true);
    try {
      await onSave({
        size: size.trim() || null,
        color: color.trim() || null,
        colorHex: color.trim() ? colorHex : null,
        sku: sku.trim() || undefined,
        stock: Math.max(0, stock),
        isActive,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{variant ? "Editar variante" : "Nueva variante"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="vf-size">Talla</Label>
              <Input id="vf-size" value={size} onChange={(e) => setSize(e.target.value)} placeholder="S, M, L…" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="vf-color">Color</Label>
              <Input id="vf-color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Negro, Blanco…" />
            </div>
          </div>
          {color.trim() && (
            <div className="space-y-1">
              <Label htmlFor="vf-hex">Color HEX</Label>
              <div className="flex items-center gap-2">
                <input
                  id="vf-hex"
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-10 h-9 cursor-pointer border border-vous-border rounded"
                />
                <Input value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="flex-1" placeholder="#000000" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="vf-stock">Stock</Label>
              <Input id="vf-stock" type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="vf-sku">SKU (opcional)</Label>
              <Input id="vf-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="ABC-001" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="vf-active" checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
            <Label htmlFor="vf-active">Activa</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || (!size.trim() && !color.trim())}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
