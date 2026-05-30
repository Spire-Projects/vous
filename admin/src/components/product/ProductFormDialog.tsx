import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ColorItem } from "@/components/shared/ColorVariantPicker";
import { StepColors, StepSizes, StepVariants, StepDetails } from "./ProductFormSteps";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepPricingVisibility } from "./StepPricingVisibility";
import { StepIndicator } from "./StepIndicator";
import type { Product, CreateProductInput, CreateVariantInput } from "@/domain/entities/product.entity";
import type { Category } from "@/domain/entities/category.entity";
import { toSlug } from "@/utils/slug";

interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: CreateProductInput, variants: CreateVariantInput[]) => Promise<void>;
}

const STEPS = [
  { label: "Básica", desc: "Nombre y categoría" },
  { label: "Colores", desc: "Colores y fotos" },
  { label: "Tallas", desc: "Tallas disponibles" },
  { label: "Stock", desc: "Inventario por variante" },
  { label: "Detalles", desc: "Materiales y atributos" },
  { label: "Precios", desc: "Precio y visibilidad" },
];

export function ProductFormDialog({ open, product, categories, onClose, onSave }: ProductFormDialogProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [detail, setDetail] = useState(product?.detail ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [wholesalePrice, setWholesalePrice] = useState(product?.wholesalePrice ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [sortOrder] = useState(product?.sortOrder ?? 0);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [colors, setColors] = useState<ColorItem[]>(product?.colors ?? []);
  const [materials, setMaterials] = useState<string[]>(product?.materials ?? []);
  const [attributes, setAttributes] = useState<Record<string, string>>(product?.attributes ?? {});
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isPreorder, setIsPreorder] = useState(product?.isPreorder ?? false);
  const [isSpecialCollection, setIsSpecialCollection] = useState(product?.isSpecialCollection ?? false);
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller ?? false);
  const [isDiscounted, setIsDiscounted] = useState(product?.isDiscounted ?? false);
  const [discountPercentage, setDiscountPercentage] = useState(product?.discountPercentage ?? 0);
  const [wholesaleOnly, setWholesaleOnly] = useState(product?.wholesaleOnly ?? false);
  const [wholesaleStock, setWholesaleStock] = useState(product?.wholesaleStock ?? 0);
  const [slugManual, setSlugManual] = useState(!!product);
  const [saving, setSaving] = useState(false);
  const [variants, setVariants] = useState<CreateVariantInput[]>([]);

  const catName = categories.find((c) => c.id === categoryId)?.name ?? "";
  const hasVariants = sizes.length > 0 || colors.length > 0;
  function handleNameChange(v: string) { setName(v); if (!slugManual) setSlug(toSlug(v)); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !detail.trim() || !categoryId) return;
    setSaving(true);
    try {
      await onSave({
        name, slug, description, detail, categoryId, categoryName: catName,
        images, price, wholesalePrice: wholesalePrice > 0 ? wholesalePrice : undefined,
        stock: hasVariants ? 0 : stock, sortOrder, sizes, colors, materials,
        attributes, tags, badge: badge.trim() || undefined, hasVariants,
        isActive, isFeatured, isPreorder, isSpecialCollection, isBestseller,
        isDiscounted, discountPercentage: isDiscounted ? discountPercentage : 0,
        wholesaleOnly, wholesaleStock: wholesaleOnly ? Math.max(0, Math.floor(wholesaleStock)) : undefined,
      }, variants);
      onClose();
    } finally { setSaving(false); }
  }
  const flags = [
    { id: "isActive", label: "Activo (visible en tienda)", value: isActive, set: setIsActive },
    { id: "isFeatured", label: "Destacado", value: isFeatured, set: setIsFeatured },
    { id: "isPreorder", label: "Preventa", value: isPreorder, set: setIsPreorder },
    { id: "isSpecialCollection", label: "Colección Especial", value: isSpecialCollection, set: setIsSpecialCollection },
    { id: "isBestseller", label: "Más Vendido", value: isBestseller, set: setIsBestseller },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {product ? "Editar Producto" : "Nuevo Producto"} — Paso {step + 1} de {STEPS.length}
          </DialogTitle>
          <p className="text-[11px] text-vous-gray font-sans">{STEPS[step].desc}</p>
        </DialogHeader>

        <StepIndicator steps={STEPS} current={step} onChange={setStep} />
        <form onSubmit={handleSubmit} className="space-y-5 pb-2">
          {step === 0 && <StepBasicInfo name={name} slug={slug} description={description} detail={detail}
            categoryId={categoryId} categories={categories} onNameChange={handleNameChange}
            onSlugChange={(v) => { setSlug(v); setSlugManual(true); }}
            onDescriptionChange={setDescription} onDetailChange={setDetail} onCategoryChange={setCategoryId} />}

          {step === 1 && <StepColors colors={colors} productImages={images}
            onColorsChange={setColors} onProductImagesChange={setImages} />}

          {step === 2 && <StepSizes sizes={sizes} onSizesChange={setSizes} />}
          {step === 3 && <StepVariants colors={colors} sizes={sizes} variants={variants}
            onVariantsChange={setVariants} />}

          {step === 4 && <StepDetails materials={materials} attributes={attributes} badge={badge}
            onMaterialsChange={setMaterials} onAttributesChange={setAttributes} onBadgeChange={setBadge} />}
          {step === 5 && <StepPricingVisibility price={price} wholesalePrice={wholesalePrice}
            stock={stock} hasVariants={hasVariants} isDiscounted={isDiscounted}
            discountPercentage={discountPercentage} wholesaleOnly={wholesaleOnly}
            wholesaleStock={wholesaleStock} tags={tags} flags={flags}
            onPriceChange={setPrice} onWholesalePriceChange={setWholesalePrice}
            onStockChange={setStock} onDiscountedChange={setIsDiscounted}
            onDiscountPctChange={setDiscountPercentage} onWholesaleOnlyChange={setWholesaleOnly}
            onWholesaleStockChange={setWholesaleStock} onTagsChange={setTags} />}

          <div className="flex justify-between gap-3 pt-2 border-t border-vous-border">
            <div className="flex gap-2">
              {step > 0 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={14} /> Anterior</Button>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              {step < STEPS.length - 1
                ? <Button type="button" onClick={() => setStep(step + 1)}>Siguiente <ChevronRight size={14} /></Button>
                : <Button type="submit" disabled={saving}>
                    {saving ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
                  </Button>}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
