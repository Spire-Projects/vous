import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import type { ColorItem } from "@/components/shared/ColorVariantPicker";
import { StepColors, StepVariants } from "./ProductFormSteps";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepSizes } from "./StepSizes";
import { StepDetails } from "./StepDetails";
import { StepPricingVisibility } from "./StepPricingVisibility";
import { StepIndicator } from "./StepIndicator";
import { useClothingConfig } from "@/hooks/useClothingConfig";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import type { Product, CreateProductInput, CreateVariantInput, ProductVariant } from "@/domain/entities/product.entity";
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
  { label: "Basica", desc: "Nombre y categoria" },
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
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(new Set());
  const [variants, setVariants] = useState<CreateVariantInput[]>([]);
  const [existingVariants, setExistingVariants] = useState<ProductVariant[]>([]);

  const { sizes: configSizes, materials: configMaterials, attributes: configAttributes, badges: configBadges, createSize } = useClothingConfig();

  // Load existing variants when editing
  useEffect(() => {
    if (!product) {
      setExistingVariants([]);
      return;
    }
    firestoreProductRepository.findVariants(product.id)
      .then((data) => setExistingVariants(data))
      .catch(() => setExistingVariants([]));
  }, [product?.id]);

  const catName = categories.find((c) => c.id === categoryId)?.name ?? "";
  const hasVariants = sizes.length > 0 || colors.length > 0;

  function handleNameChange(v: string) { setName(v); if (!slugManual) setSlug(toSlug(v)); }

  // Validation per step
  const stepErrors = useMemo(() => {
    const errors: Record<number, string[]> = {};
    // Step 0: Basic info
    const s0: string[] = [];
    if (!name.trim()) s0.push("Nombre es obligatorio");
    if (!slug.trim()) s0.push("Slug es obligatorio");
    if (!categoryId) s0.push("Categoria es obligatoria");
    if (!detail.trim()) s0.push("Detalle es obligatorio");
    if (s0.length) errors[0] = s0;

    // Step 3: Stock
    const s3: string[] = [];
    if (hasVariants) {
      const totalVariants = existingVariants.length + variants.length;
      const allVariants = [...existingVariants, ...variants];
      if (totalVariants === 0) s3.push("Debes agregar al menos una variante con stock");
      else if (allVariants.every((v) => v.stock <= 0)) s3.push("Al menos una variante debe tener stock mayor a 0");
    } else {
      if (stock <= 0) s3.push("Stock debe ser mayor a 0 cuando no hay variantes");
    }
    if (s3.length) errors[3] = s3;

    // Step 5: Pricing
    const s5: string[] = [];
    if (price <= 0) s5.push("Precio de venta debe ser mayor a 0");
    if (isDiscounted && (discountPercentage <= 0 || discountPercentage > 100)) s5.push("Descuento debe estar entre 1 y 100");
    if (s5.length) errors[5] = s5;

    return errors;
  }, [name, slug, categoryId, detail, hasVariants, existingVariants, variants, stock, price, isDiscounted, discountPercentage]);

  function canProceed(toStep: number) {
    // Can always go backwards
    if (toStep <= step) return true;
    // Can proceed if all previous required steps are valid
    for (let i = 0; i < toStep; i++) {
      if (stepErrors[i]?.length) return false;
    }
    return true;
  }

  function goToStep(toStep: number) {
    if (toStep === step) return;
    // Mark current step as touched when leaving it
    if (toStep > step) {
      setTouchedSteps((prev) => new Set(prev).add(step));
    }
    setTouchedSteps((prev) => new Set(prev).add(toStep));
    if (canProceed(toStep)) {
      setStep(toStep);
    }
  }

  function goNext() {
    setTouchedSteps((prev) => new Set(prev).add(step));
    if (canProceed(step + 1)) {
      setStep((s) => s + 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate all steps
    const allErrors = Object.values(stepErrors).flat();
    if (allErrors.length > 0) {
      // Jump to first invalid step
      const firstInvalid = Object.keys(stepErrors).map(Number).sort((a, b) => a - b)[0];
      if (firstInvalid !== undefined) setStep(firstInvalid);
      return;
    }
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
    { id: "isSpecialCollection", label: "Coleccion Especial", value: isSpecialCollection, set: setIsSpecialCollection },
    { id: "isBestseller", label: "Mas Vendido", value: isBestseller, set: setIsBestseller },
  ] as const;

  const currentErrors = stepErrors[step] ?? [];
  const showErrors = touchedSteps.has(step) && currentErrors.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {product ? "Editar Producto" : "Nuevo Producto"} — Paso {step + 1} de {STEPS.length}
          </DialogTitle>
          <p className="text-[11px] text-vous-text-secondary font-sans">{STEPS[step].desc}</p>
        </DialogHeader>

        <StepIndicator steps={STEPS} current={step} onChange={goToStep} stepErrors={stepErrors} />

        {showErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-red-700 text-[11px] font-semibold">
              <AlertCircle size={13} />
              Completa los campos obligatorios para continuar:
            </div>
            <ul className="list-disc list-inside text-[11px] text-red-600">
              {currentErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 pb-2">
          {step === 0 && <StepBasicInfo name={name} slug={slug} description={description} detail={detail}
            categoryId={categoryId} categories={categories} onNameChange={handleNameChange}
            onSlugChange={(v) => { setSlug(v); setSlugManual(true); }}
            onDescriptionChange={setDescription} onDetailChange={setDetail} onCategoryChange={setCategoryId} />}

          {step === 1 && <StepColors colors={colors} productImages={images}
            onColorsChange={setColors} onProductImagesChange={setImages} />}

          {step === 2 && <StepSizes sizes={sizes} configSizes={configSizes} onSizesChange={setSizes} onCreateConfigSize={async (name) => { await createSize({ name, sortOrder: configSizes.length, isActive: true }); }} />}
          {step === 3 && <StepVariants colors={colors} sizes={sizes} variants={variants}
            existingVariants={existingVariants}
            onVariantsChange={setVariants} />}

          {step === 4 && <StepDetails
            materials={materials}
            attributes={attributes}
            badge={badge}
            configMaterials={configMaterials}
            configAttributes={configAttributes}
            configBadges={configBadges}
            onMaterialsChange={setMaterials}
            onAttributesChange={setAttributes}
            onBadgeChange={setBadge}
          />}
          {step === 5 && <StepPricingVisibility price={price} wholesalePrice={wholesalePrice}
            stock={stock} hasVariants={hasVariants} isDiscounted={isDiscounted}
            discountPercentage={discountPercentage} wholesaleOnly={wholesaleOnly}
            wholesaleStock={wholesaleStock} tags={tags} flags={flags}
            onPriceChange={setPrice} onWholesalePriceChange={setWholesalePrice}
            onStockChange={setStock} onDiscountedChange={setIsDiscounted}
            onDiscountPctChange={setDiscountPercentage} onWholesaleOnlyChange={setWholesaleOnly}
            onWholesaleStockChange={setWholesaleStock} onTagsChange={setTags} />}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/40">
            <div className="flex gap-2">
              {step > 0 && <Button type="button" variant="outline" onClick={() => goToStep(step - 1)}>
                <ChevronLeft size={14} /> Anterior</Button>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              {step < STEPS.length - 1
                ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={touchedSteps.has(step) && currentErrors.length > 0}
                  >
                    Siguiente <ChevronRight size={14} />
                  </Button>
                )
                : <Button type="submit" disabled={saving || Object.keys(stepErrors).length > 0}>
                    {saving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
                  </Button>}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
