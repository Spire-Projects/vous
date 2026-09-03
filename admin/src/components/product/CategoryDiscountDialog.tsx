import { useState } from "react";
import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import type { Category } from "@/domain/entities/category.entity";

interface CategoryDiscountDialogProps {
  open: boolean;
  categories: Category[];
  onClose: () => void;
  onApply: (categoryId: string, isDiscounted: boolean, discountPercentage?: number) => Promise<void>;
}

export function CategoryDiscountDialog({
  open,
  categories,
  onClose,
  onApply,
}: CategoryDiscountDialogProps) {
  const [categoryId, setCategoryId] = useState("");
  const [discounted, setDiscounted] = useState(false);
  const [discountPct, setDiscountPct] = useState(10);
  const [saving, setSaving] = useState(false);

  const activeCategories = categories.filter((c) => c.isActive);

  async function handleApply() {
    if (!categoryId) return;
    setSaving(true);
    try {
      await onApply(categoryId, discounted, discounted ? discountPct : undefined);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-nav text-[15px]">Descuento por Categoría</DialogTitle>
          <DialogDescription className="text-[11px]">
            Aplica o quita descuento a todos los productos de una categoría.
            Los descuentos individuales de producto tienen prioridad.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label>Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría..." />
              </SelectTrigger>
              <SelectContent>
                {activeCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={discounted} onCheckedChange={(c) => setDiscounted(Boolean(c))} id="cd-disc" />
            <Percent size={14} className="text-red-600" />
            <span className="font-sans text-[13px] text-vous-text">Aplicar descuento</span>
          </label>

          {discounted && (
            <div>
              <Label>Porcentaje (%)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  min={1}
                  max={90}
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Math.max(0, Math.min(90, Number(e.target.value))))}
                  className="w-20"
                />
                <span className="text-[11px] text-vous-text-secondary font-sans">
                  Se aplicará a todos los productos de la categoría
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => void handleApply()} disabled={saving || !categoryId}>
            {saving ? "Aplicando..." : discounted ? "Aplicar descuento" : "Quitar descuento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
