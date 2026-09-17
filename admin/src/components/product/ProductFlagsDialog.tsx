import { useState } from "react";
import { Star, Flame, Package, Sparkles, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import type { Product } from "@/domain/entities/product.entity";
import type { ProductFlags } from "@/domain/repositories/product.repository";

interface ProductFlagsDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (id: string, flags: ProductFlags) => Promise<void>;
  onApplyDiscount: (id: string, isDiscounted: boolean, discountPercentage?: number) => Promise<void>;
}

export function ProductFlagsDialog({
  open,
  product,
  onClose,
  onSave,
  onApplyDiscount,
}: ProductFlagsDialogProps) {
  const [saving, setSaving] = useState(false);

  const [featured, setFeatured] = useState(false);
  const [preorder, setPreorder] = useState(false);
  const [specialCollection, setSpecialCollection] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [discounted, setDiscounted] = useState(false);
  const [discountPct, setDiscountPct] = useState<number>(0);

  useState(() => {
    if (product) {
      setFeatured(product.isFeatured);
      setPreorder(product.isPreorder);
      setSpecialCollection(product.isSpecialCollection);
      setBestseller(product.isBestseller);
      setDiscounted(product.isDiscounted);
      setDiscountPct(product.discountPercentage ?? 0);
    }
  });

  async function handleSave() {
    if (!product) return;
    setSaving(true);
    try {
      await onSave(product.id, {
        isFeatured: featured,
        isPreorder: preorder,
        isSpecialCollection: specialCollection,
        isBestseller: bestseller,
      });
      await onApplyDiscount(product.id, discounted, discounted ? discountPct : undefined);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-nav text-[15px]">Configurar producto</DialogTitle>
          <DialogDescription className="text-[11px]">{product.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Flags */}
          <div className="space-y-2.5">
            <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Marcadores</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={featured} onCheckedChange={(c) => setFeatured(Boolean(c))} id="pf-feat" />
              <Star size={14} className="text-amber-600" />
              <span className="font-sans text-[13px] text-vous-text">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={preorder} onCheckedChange={(c) => setPreorder(Boolean(c))} id="pf-pre" />
              <Package size={14} className="text-blue-600" />
              <span className="font-sans text-[13px] text-vous-text">Preventa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={specialCollection} onCheckedChange={(c) => setSpecialCollection(Boolean(c))} id="pf-spec" />
              <Sparkles size={14} className="text-purple-600" />
              <span className="font-sans text-[13px] text-vous-text">Colección Especial</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={bestseller} onCheckedChange={(c) => setBestseller(Boolean(c))} id="pf-best" />
              <Flame size={14} className="text-green-600" />
              <span className="font-sans text-[13px] text-vous-text">Más Vendido</span>
            </label>
          </div>

          {/* Discount */}
          <div className="border-t border-white/40 pt-4 space-y-2.5">
            <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Descuento</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={discounted} onCheckedChange={(c) => setDiscounted(Boolean(c))} id="pf-disc" />
              <Percent size={14} className="text-red-600" />
              <span className="font-sans text-[13px] text-vous-text">Aplicar descuento</span>
            </label>
            {discounted && (
              <div className="pl-7">
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
                    Precio: Bs. {Math.max(Math.round(product.price * (1 - discountPct / 100)), 1).toLocaleString("es-BO")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
