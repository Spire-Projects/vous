import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { ColorVariantPicker, type ColorItem } from "@/components/shared/ColorVariantPicker";
import { AttributeEditor } from "@/components/shared/AttributeEditor";
import { ChipInput } from "@/components/shared/ChipInput";
import { VariantEditor } from "./VariantEditor";
import type { CreateVariantInput } from "@/domain/entities/product.entity";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-nav text-[10px] uppercase tracking-widest text-vous-gray border-b border-vous-border pb-1 mb-1">
      {children}
    </p>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-vous-gray leading-relaxed mb-2">{children}</p>;
}

interface StepColorsProps {
  colors: ColorItem[];
  productImages: string[];
  onColorsChange: (v: ColorItem[]) => void;
  onProductImagesChange: (v: string[]) => void;
}

export function StepColors({ colors, productImages, onColorsChange, onProductImagesChange }: StepColorsProps) {
  return (
    <section className="space-y-4">
      <SectionTitle>Colores y fotos</SectionTitle>
      <HelpText>Cada color puede tener sus propias fotos. Cuando el cliente seleccione un color, verá las fotos específicas. Las fotos generales se muestran cuando no hay color seleccionado.</HelpText>
      <div className="space-y-1">
        <Label>Colores del producto</Label>
        <ColorVariantPicker value={colors} onChange={onColorsChange} />
      </div>
      <div className="space-y-1 pt-2">
        <Label>Fotos generales</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {productImages.map((img, i) => (
            <div key={i} className="relative w-14 h-14 border border-vous-border">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onProductImagesChange(productImages.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
        <ImagePicker value="" onChange={(url) => onProductImagesChange([...productImages, url])} folder="vous/products" label="Agregar foto general" aspect="square" />
      </div>
    </section>
  );
}

interface StepSizesProps {
  sizes: string[];
  onSizesChange: (v: string[]) => void;
}

export function StepSizes({ sizes, onSizesChange }: StepSizesProps) {
  return (
    <section className="space-y-3">
      <SectionTitle>Tallas disponibles</SectionTitle>
      <HelpText>Escribe cada talla y presiona Enter. Si el producto no tiene tallas, deja este campo vacío.</HelpText>
      <div className="space-y-1">
        <Label>Tallas</Label>
        <ChipInput value={sizes} onChange={onSizesChange} placeholder="XS, S, M, L, XL…" />
      </div>
    </section>
  );
}

interface StepVariantsProps {
  colors: ColorItem[];
  sizes: string[];
  variants: CreateVariantInput[];
  onVariantsChange: (v: CreateVariantInput[]) => void;
}

export function StepVariants({ colors, sizes, variants, onVariantsChange }: StepVariantsProps) {
  const hasAny = sizes.length > 0 || colors.length > 0;
  return (
    <section className="space-y-3">
      <SectionTitle>Stock por variante</SectionTitle>
      {!hasAny ? (
        <HelpText>Aún no has agregado colores ni tallas. Ve a los pasos Colores y Tallas para definir las opciones.</HelpText>
      ) : (
        <HelpText>Agrega manualmente las combinaciones de color y talla que existen. Cada variante tiene su propio stock y SKU opcional.</HelpText>
      )}
      <VariantEditor colors={colors} sizes={sizes} variants={variants} onChange={onVariantsChange} />
    </section>
  );
}

interface StepDetailsProps {
  materials: string[]; attributes: Record<string, string>; badge: string;
  onMaterialsChange: (v: string[]) => void; onAttributesChange: (v: Record<string, string>) => void;
  onBadgeChange: (v: string) => void;
}

export function StepDetails({ materials, attributes, badge, onMaterialsChange, onAttributesChange, onBadgeChange }: StepDetailsProps) {
  return (
    <section className="space-y-3">
      <SectionTitle>Características de la prenda</SectionTitle>
      <HelpText>Estos detalles ayudan al cliente a conocer mejor el producto.</HelpText>
      <div className="space-y-1">
        <Label>Materiales</Label>
        <ChipInput value={materials} onChange={onMaterialsChange} placeholder="Algodón, Lana, Poliéster…" />
      </div>
      <div className="space-y-1">
        <Label>Atributos (corte, tela, pretina, largo…)</Label>
        <AttributeEditor value={attributes} onChange={onAttributesChange} />
      </div>
      <div className="space-y-1">
        <Label>Etiqueta especial (Badge)</Label>
        <Input value={badge} onChange={(e) => onBadgeChange(e.target.value)} placeholder="Nuevo, Sale, Exclusivo…" />
        <p className="text-[10px] text-vous-gray mt-1">Aparece como una etiqueta sobre la foto del producto.</p>
      </div>
    </section>
  );
}
