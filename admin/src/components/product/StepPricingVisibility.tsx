import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChipInput } from "@/components/shared/ChipInput";

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

interface StepPricingVisibilityProps {
  price: number; wholesalePrice: number; stock: number; hasVariants: boolean;
  isDiscounted: boolean; discountPercentage: number; wholesaleOnly: boolean; wholesaleStock: number;
  tags: string[];
  flags: readonly { id: string; label: string; value: boolean; set: (v: boolean) => void }[];
  onPriceChange: (v: number) => void; onWholesalePriceChange: (v: number) => void;
  onStockChange: (v: number) => void; onDiscountedChange: (v: boolean) => void;
  onDiscountPctChange: (v: number) => void; onWholesaleOnlyChange: (v: boolean) => void;
  onWholesaleStockChange: (v: number) => void;
  onTagsChange: (v: string[]) => void;
}

export function StepPricingVisibility({
  price, wholesalePrice, stock, hasVariants, isDiscounted, discountPercentage,
  wholesaleOnly, wholesaleStock, tags, flags,
  onPriceChange, onWholesalePriceChange, onStockChange, onDiscountedChange,
  onDiscountPctChange, onWholesaleOnlyChange, onWholesaleStockChange, onTagsChange,
}: StepPricingVisibilityProps) {
  return (
    <section className="space-y-3">
      <SectionTitle>Precios</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Precio de venta (Bs) *</Label>
          <Input type="number" min={0} value={price} onChange={(e) => onPriceChange(Number(e.target.value))} />
        </div>
        <div className="space-y-1">
          <Label>Precio mayorista (Bs)</Label>
          <Input type="number" min={0} value={wholesalePrice} onChange={(e) => onWholesalePriceChange(Number(e.target.value))} placeholder="Opcional" />
        </div>
      </div>

      <div className="space-y-1">
        <Label>{hasVariants ? "Stock general (solo si no usas variantes)" : "Stock total *"}</Label>
        <Input type="number" min={0} value={stock} onChange={(e) => onStockChange(Number(e.target.value))} disabled={hasVariants} />
        {hasVariants && <p className="text-[10px] text-vous-gray">El stock se gestiona por variante en el paso anterior.</p>}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Checkbox id="isDiscounted" checked={isDiscounted} onCheckedChange={(v) => onDiscountedChange(v === true)} />
          <Label htmlFor="isDiscounted" className="mb-0">Aplicar descuento</Label>
        </div>
        {isDiscounted && (
          <Input type="number" min={0} max={100} value={discountPercentage} onChange={(e) => onDiscountPctChange(Number(e.target.value))} className="w-24" placeholder="%" />
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Checkbox id="wholesaleOnly" checked={wholesaleOnly} onCheckedChange={(v) => onWholesaleOnlyChange(v === true)} />
          <Label htmlFor="wholesaleOnly" className="mb-0">Exclusivo mayoristas</Label>
        </div>
        {wholesaleOnly && (
          <div className="space-y-1">
            <Label className="text-[11px]">Stock mayorista</Label>
            <Input type="number" min={0} value={wholesaleStock} onChange={(e) => onWholesaleStockChange(Math.max(0, Math.floor(Number(e.target.value)) || 0))} className="w-24" />
          </div>
        )}
      </div>

      <SectionTitle>Visibilidad</SectionTitle>
      <HelpText>Controla dónde y cómo aparece este producto en la tienda.</HelpText>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {flags.map(({ id, label, value, set }) => (
          <div key={id} className="flex items-center gap-2">
            <Checkbox id={id} checked={value} onCheckedChange={(v) => set(v === true)} />
            <Label htmlFor={id} className="mb-0">{label}</Label>
          </div>
        ))}
      </div>

      <div className="space-y-1 pt-1">
        <Label>Etiquetas (Tags)</Label>
        <ChipInput value={tags} onChange={onTagsChange} placeholder="verano, casual, formal…" />
        <p className="text-[10px] text-vous-gray">Ayudan a los clientes a encontrar productos por estilo u ocasión.</p>
      </div>
    </section>
  );
}
