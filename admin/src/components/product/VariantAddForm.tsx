import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "@/components/shared/ImagePicker";
import type { ColorItem } from "@/components/shared/ColorVariantPicker";
import type { CreateVariantInput } from "@/domain/entities/product.entity";

interface VariantAddFormProps {
  colors: ColorItem[];
  sizes: string[];
  onAdd: (variant: CreateVariantInput) => void;
  onCancel: () => void;
}

export function VariantAddForm({ colors, sizes, onAdd, onCancel }: VariantAddFormProps) {
  const [selColor, setSelColor] = useState("");
  const [selSize, setSelSize] = useState("");
  const [selStock, setSelStock] = useState(0);
  const [selSku, setSelSku] = useState("");
  const [images, setImages] = useState<string[]>([]);

  function handleAdd() {
    if (!selColor && !selSize) return;
    const colorObj = colors.find((c) => c.name === selColor);
    onAdd({
      color: selColor || null,
      colorHex: colorObj?.hex ?? null,
      size: selSize || null,
      stock: selStock,
      sku: selSku.trim() || undefined,
      isActive: true,
      images: images.length > 0 ? images : undefined,
    });
    setSelColor("");
    setSelSize("");
    setSelStock(0);
    setSelSku("");
    setImages([]);
  }

  function addImage(url: string) {
    if (!url || images.includes(url)) return;
    setImages([...images, url]);
  }

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="border border-vous-border p-3 space-y-3 bg-white/90/20">
      <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Nueva variante</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {colors.length > 0 && (
          <div className="space-y-1">
            <Label className="text-[10px]">Color</Label>
            <Select value={selColor} onValueChange={setSelColor}>
              <SelectTrigger className="h-8 text-[11px]">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border" style={{ background: c.hex }} />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {sizes.length > 0 && (
          <div className="space-y-1">
            <Label className="text-[10px]">Talla</Label>
            <Select value={selSize} onValueChange={setSelSize}>
              <SelectTrigger className="h-8 text-[11px]">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-1">
          <Label className="text-[10px]">Stock</Label>
          <Input type="number" min={0} value={selStock} onChange={(e) => setSelStock(Math.max(0, Number(e.target.value) || 0))} className="h-8 text-[11px]" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">SKU (opcional)</Label>
          <Input value={selSku} onChange={(e) => setSelSku(e.target.value)} placeholder="ABC-001" className="h-8 text-[11px]" />
        </div>
      </div>

      {/* Variant images */}
      <div className="space-y-2">
        <Label className="text-[10px]">Imagenes de la variante</Label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-14 h-14 border border-vous-border rounded overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <ImagePicker
          value=""
          onChange={addImage}
          folder="vous/products/variants"
          label="Agregar imagen"
          aspect="square"
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleAdd} disabled={!selColor.trim() && !selSize.trim()}>
          <Plus size={12} /> Guardar
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}
