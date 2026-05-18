import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { ColorPicker, type ColorItem } from "@/components/shared/ColorPicker";
import type { Product, CreateProductInput } from "@/domain/entities/product.entity";
import type { Category } from "@/domain/entities/category.entity";
import { toSlug } from "@/utils/slug";

interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: CreateProductInput) => Promise<void>;
}

export function ProductFormDialog({ open, product, categories, onClose, onSave }: ProductFormDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [materials, setMaterials] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  function handleNameChange(v: string) {
    setName(v);
    if (!slugManual) setSlug(toSlug(v));
  }
  const [badge, setBadge] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [saving, setSaving] = useState(false);

  const catName = categories.find((c) => c.id === categoryId)?.name ?? "";

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (product) {
      setName(product.name); setSlug(product.slug); setDescription(product.description); setDetail(product.detail);
      setCategoryId(product.categoryId); setPrice(product.price); setStock(product.stock);
      setImages(product.images); setSizes(product.sizes.join(", ")); setColors(product.colors);
      setMaterials(product.materials.join(", ")); setBadge(product.badge ?? ""); setSlugManual(true);
      setIsActive(product.isActive); setIsFeatured(product.isFeatured); setIsDiscounted(product.isDiscounted);
      setDiscountPercentage(product.discountPercentage ?? 0);
    } else {
      setName(""); setSlug(""); setDescription(""); setDetail(""); setCategoryId(""); setPrice(0); setStock(0);
      setImages([]); setSizes(""); setColors([]); setMaterials(""); setBadge(""); setSlugManual(false);
      setIsActive(true); setIsFeatured(false); setIsDiscounted(false); setDiscountPercentage(0);
    }
  }, [product, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleAddImage(url: string) { setImages((prev) => [...prev, url]); }
  function handleRemoveImage(idx: number) { setImages((prev) => prev.filter((_, i) => i !== idx)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !categoryId) return;
    setSaving(true);
    try {
      await onSave({
        name, slug, description, detail, categoryId, categoryName: catName,
        images, price, stock,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors,
        materials: materials.split(",").map((m) => m.trim()).filter(Boolean),
        badge: badge || undefined,
        hasVariants: sizes.trim().length > 0 || colors.length > 0,
        isActive, isFeatured, isDiscounted,
        discountPercentage: isDiscounted ? discountPercentage : 0,
        sortOrder: 0,
      });
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Nombre *</Label><Input required value={name} onChange={(e) => handleNameChange(e.target.value)} /></div>
            <div className="space-y-1"><Label>Slug *</Label><Input required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} placeholder="nombre-del-producto" /></div>
          </div>
          <div className="space-y-1"><Label>Descripción</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="space-y-1"><Label>Detalle</Label><Textarea value={detail} onChange={(e) => setDetail(e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Categoría *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Precio (Bs) *</Label><Input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} /></div>
            <div className="space-y-1"><Label>Stock *</Label><Input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} /></div>
          </div>
          <div className="space-y-1">
            <Label>Imágenes</Label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 border border-vous-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => handleRemoveImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full">×</button>
                </div>
              ))}
            </div>
            <ImagePicker value="" onChange={handleAddImage} folder="vous/products" label="Agregar imagen" aspect="square" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1"><Label>Tallas (separadas por coma)</Label><Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="XS, S, M, L, XL" /></div>
            <div className="space-y-1 col-span-3"><Label>Colores</Label><ColorPicker value={colors} onChange={setColors} /></div>
            <div className="space-y-1"><Label>Materiales</Label><Input value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="Lana, Algodón" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Badge</Label><Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Nuevo, Descuento..." /></div>
            <div className="space-y-1"><Label>% Descuento</Label><Input type="number" min={0} max={100} value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))} disabled={!isDiscounted} /></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} /><Label className="mb-0">Activo</Label></div>
            <div className="flex items-center gap-2"><Checkbox checked={isFeatured} onCheckedChange={(v) => setIsFeatured(v === true)} /><Label className="mb-0">Destacado</Label></div>
            <div className="flex items-center gap-2"><Checkbox checked={isDiscounted} onCheckedChange={(v) => setIsDiscounted(v === true)} /><Label className="mb-0">En descuento</Label></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
