import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { ColorPicker, type ColorItem } from "@/components/shared/ColorPicker";
import { AttributeEditor } from "@/components/shared/AttributeEditor";
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

export function ProductFormDialog({
  open,
  product,
  categories,
  onClose,
  onSave,
}: ProductFormDialogProps) {
  // State initialised from props — no useEffect needed (key-based remount in parent)
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [detail, setDetail] = useState(product?.detail ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [wholesalePrice, setWholesalePrice] = useState(product?.wholesalePrice ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(", "));
  const [colors, setColors] = useState<ColorItem[]>(product?.colors ?? []);
  const [materials, setMaterials] = useState((product?.materials ?? []).join(", "));
  const [attributes, setAttributes] = useState<Record<string, string>>(
    product?.attributes ?? {},
  );
  const [tags, setTags] = useState((product?.tags ?? []).join(", "));
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isPreorder, setIsPreorder] = useState(product?.isPreorder ?? false);
  const [isSpecialCollection, setIsSpecialCollection] = useState(
    product?.isSpecialCollection ?? false,
  );
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller ?? false);
  const [isDiscounted, setIsDiscounted] = useState(product?.isDiscounted ?? false);
  const [discountPercentage, setDiscountPercentage] = useState(
    product?.discountPercentage ?? 0,
  );
  const [wholesaleOnly, setWholesaleOnly] = useState(product?.wholesaleOnly ?? false);
  const [wholesaleStock, setWholesaleStock] = useState(product?.wholesaleStock ?? 0);
  const [slugManual, setSlugManual] = useState(!!product);
  const [saving, setSaving] = useState(false);

  function handleNameChange(v: string) {
    setName(v);
    if (!slugManual) setSlug(toSlug(v));
  }

  const catName = categories.find((c) => c.id === categoryId)?.name ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !detail.trim() || !categoryId) return;
    setSaving(true);
    try {
      await onSave({
        name,
        slug,
        description,
        detail,
        categoryId,
        categoryName: catName,
        images,
        price,
        wholesalePrice: wholesalePrice > 0 ? wholesalePrice : undefined,
        stock,
        sortOrder,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors,
        materials: materials.split(",").map((m) => m.trim()).filter(Boolean),
        attributes,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        badge: badge.trim() || undefined,
        hasVariants: sizes.trim().length > 0 || colors.length > 0,
        isActive,
        isFeatured,
        isPreorder,
        isSpecialCollection,
        isBestseller,
        isDiscounted,
        discountPercentage: isDiscounted ? discountPercentage : 0,
        wholesaleOnly,
        wholesaleStock: wholesaleOnly ? Math.max(0, Math.floor(wholesaleStock)) : undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const flags = [
    { id: "isActive", label: "Activo", value: isActive, set: setIsActive },
    { id: "isFeatured", label: "Destacado", value: isFeatured, set: setIsFeatured },
    { id: "isPreorder", label: "Preventa", value: isPreorder, set: setIsPreorder },
    {
      id: "isSpecialCollection",
      label: "Colección Especial",
      value: isSpecialCollection,
      set: setIsSpecialCollection,
    },
    { id: "isBestseller", label: "Más Vendido", value: isBestseller, set: setIsBestseller },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pb-2">
          {/* ── Información básica */}
          <section className="space-y-3">
            <SectionTitle>Información Básica</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nombre *</Label>
                <Input required value={name} onChange={(e) => handleNameChange(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Slug *</Label>
                <Input
                  required
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                  placeholder="nombre-del-producto"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Descripción</Label>
              <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Detalle *</Label>
              <Textarea
                required
                rows={3}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Descripción detallada de la prenda…"
              />
            </div>
          </section>

          {/* ── Clasificación y precios */}
          <section className="space-y-3">
            <SectionTitle>Clasificación y Precios</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1 col-span-2">
                <Label>Categoría *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Precio (Bs) *</Label>
                <Input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label>Precio Mayorista</Label>
                <Input
                  type="number"
                  min={0}
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label>Badge</Label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Nuevo, Sale…"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDiscounted"
                  checked={isDiscounted}
                  onCheckedChange={(v) => setIsDiscounted(v === true)}
                />
                <Label htmlFor="isDiscounted" className="mb-0">
                  En descuento
                </Label>
              </div>
              {isDiscounted && (
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  className="w-28"
                  placeholder="% descuento"
                />
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="wholesaleOnly"
                  checked={wholesaleOnly}
                  onCheckedChange={(v) => setWholesaleOnly(v === true)}
                />
                <Label htmlFor="wholesaleOnly" className="mb-0">
                  Solo mayoristas
                </Label>
              </div>
              {wholesaleOnly && (
                <div className="space-y-1">
                  <Label className="text-[11px]">Stock Mayorista</Label>
                  <Input
                    type="number"
                    min={0}
                    value={wholesaleStock}
                    onChange={(e) =>
                      setWholesaleStock((prev) => {
                        const parsed = Number(e.target.value);
                        if (!Number.isFinite(parsed)) return prev;
                        return Math.max(0, Math.floor(parsed));
                      })
                    }
                    className="w-28"
                  />
                </div>
              )}
            </div>
          </section>

          {/* ── Imágenes */}
          <section className="space-y-2">
            <SectionTitle>Imágenes</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 border border-vous-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <ImagePicker
              value=""
              onChange={(url) => setImages((prev) => [...prev, url])}
              folder="vous/products"
              label="Agregar imagen"
              aspect="square"
            />
          </section>

          {/* ── Atributos de prenda */}
          <section className="space-y-3">
            <SectionTitle>Atributos de Prenda</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Tallas (separadas por coma)</Label>
                <Input
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="XS, S, M, L, XL"
                />
              </div>
              <div className="space-y-1">
                <Label>Materiales</Label>
                <Input
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Lana, Algodón"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Colores</Label>
              <ColorPicker value={colors} onChange={setColors} />
            </div>
            <div className="space-y-1">
              <Label>Atributos adicionales (tela, corte, pretina, largo…)</Label>
              <AttributeEditor value={attributes} onChange={setAttributes} />
            </div>
          </section>

          {/* ── Etiquetado y visibilidad */}
          <section className="space-y-3">
            <SectionTitle>Etiquetado y Visibilidad</SectionTitle>
            <div className="space-y-1">
              <Label>Tags (separados por coma)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="verano, casual, formal…"
              />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {flags.map(({ id, label, value, set }) => (
                <div key={id} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={value}
                    onCheckedChange={(v) => set(v === true)}
                  />
                  <Label htmlFor={id} className="mb-0">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-2 border-t border-vous-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-nav text-[10px] uppercase tracking-widest text-vous-gray border-b border-vous-border pb-1">
      {children}
    </p>
  );
}
