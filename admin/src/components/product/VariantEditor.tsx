import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VariantAddForm } from "./VariantAddForm";
import type { ColorItem } from "@/components/shared/ColorVariantPicker";
import type { CreateVariantInput } from "@/domain/entities/product.entity";

interface VariantEditorProps {
  colors: ColorItem[];
  sizes: string[];
  variants: CreateVariantInput[];
  onChange: (variants: CreateVariantInput[]) => void;
}

export function VariantEditor({ colors, sizes, variants, onChange }: VariantEditorProps) {
  const [showForm, setShowForm] = useState(false);
  const hasAny = sizes.length > 0 || colors.length > 0;

  function addVariant(v: CreateVariantInput) {
    onChange([...variants, v]);
    setShowForm(false);
  }

  function removeVariant(idx: number) {
    onChange(variants.filter((_, i) => i !== idx));
  }

  if (!hasAny) {
    return (
      <p className="text-[11px] text-vous-gray">
        Aún no has agregado colores ni tallas. Regresa a los pasos Colores y Tallas para definir las opciones.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {variants.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Talla</TableHead>
              <TableHead className="w-20">Stock</TableHead>
              <TableHead className="w-32">SKU</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((v, i) => (
              <TableRow key={i}>
                <TableCell>
                  {v.color ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-nav uppercase">
                      <span className="w-3.5 h-3.5 rounded-full border border-vous-border inline-block" style={{ background: v.colorHex ?? "#888" }} />
                      {v.color}
                    </span>
                  ) : (
                    <span className="text-vous-gray text-[11px]">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-nav uppercase">{v.size ?? <span className="text-vous-gray">—</span>}</span>
                </TableCell>
                <TableCell>
                  <span className={`text-[12px] font-nav font-semibold ${v.stock <= 0 ? "text-red-500" : ""}`}>{v.stock}</span>
                </TableCell>
                <TableCell className="text-[10px] text-vous-gray font-mono">{v.sku ?? "—"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" className="text-vous-gray hover:text-red-500" onClick={() => removeVariant(i)}>
                    <Trash2 size={13} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!showForm ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
          <Plus size={13} /> Agregar variante
        </Button>
      ) : (
        <VariantAddForm colors={colors} sizes={sizes} onAdd={addVariant} onCancel={() => setShowForm(false)} />
      )}

      {variants.length === 0 && !showForm && (
        <p className="text-[11px] text-vous-gray">No hay variantes aún. Agrega las combinaciones de color y talla que existen.</p>
      )}
    </div>
  );
}
