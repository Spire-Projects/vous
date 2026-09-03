import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VariantAddForm } from "./VariantAddForm";
import type { ColorItem } from "@/components/shared/ColorVariantPicker";
import type { CreateVariantInput, ProductVariant } from "@/domain/entities/product.entity";

interface VariantEditorProps {
  colors: ColorItem[];
  sizes: string[];
  variants: CreateVariantInput[];
  existingVariants?: ProductVariant[];
  onChange: (variants: CreateVariantInput[]) => void;
}

export function VariantEditor({ colors, sizes, variants, existingVariants = [], onChange }: VariantEditorProps) {
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
      <p className="text-[11px] text-vous-text-secondary">
        Aun no has agregado colores ni tallas. Regresa a los pasos Colores y Tallas para definir las opciones.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Existing variants (read-only when editing) */}
      {existingVariants.length > 0 && (
        <div className="space-y-1">
          <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
            Variantes guardadas ({existingVariants.length})
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Imagenes</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead className="w-20">Stock</TableHead>
                <TableHead className="w-32">SKU</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingVariants.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    {v.images && v.images.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <div className="relative w-10 h-10 border border-vous-border rounded overflow-hidden">
                          <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                          {v.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 rounded-tl">
                              +{v.images.length - 1}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-vous-text-secondary text-[11px]">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {v.color ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-nav uppercase">
                        <span className="w-3.5 h-3.5 rounded-full border border-vous-border inline-block" style={{ background: v.colorHex ?? "#888" }} />
                        {v.color}
                      </span>
                    ) : (
                      <span className="text-vous-text-secondary text-[11px]">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-nav uppercase">{v.size ?? <span className="text-vous-text-secondary">—</span>}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[12px] font-nav font-semibold ${v.stock <= 0 ? "text-red-600" : ""}`}>{v.stock}</span>
                  </TableCell>
                  <TableCell className="text-[10px] text-vous-text-secondary font-mono">{v.sku ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* New variants */}
      {variants.length > 0 && (
        <div className="space-y-1">
          <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
            Nuevas variantes a guardar ({variants.length})
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Imagenes</TableHead>
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
                    {v.images && v.images.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <div className="relative w-10 h-10 border border-vous-border rounded overflow-hidden">
                          <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                          {v.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 rounded-tl">
                              +{v.images.length - 1}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-vous-text-secondary text-[11px]">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {v.color ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-nav uppercase">
                        <span className="w-3.5 h-3.5 rounded-full border border-vous-border inline-block" style={{ background: v.colorHex ?? "#888" }} />
                        {v.color}
                      </span>
                    ) : (
                      <span className="text-vous-text-secondary text-[11px]">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-nav uppercase">{v.size ?? <span className="text-vous-text-secondary">—</span>}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[12px] font-nav font-semibold ${v.stock <= 0 ? "text-red-600" : ""}`}>{v.stock}</span>
                  </TableCell>
                  <TableCell className="text-[10px] text-vous-text-secondary font-mono">{v.sku ?? "—"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm" className="text-vous-text-secondary hover:text-red-700" onClick={() => removeVariant(i)}>
                      <Trash2 size={13} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!showForm ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
          <Plus size={13} /> Agregar variante
        </Button>
      ) : (
        <VariantAddForm colors={colors} sizes={sizes} onAdd={addVariant} onCancel={() => setShowForm(false)} />
      )}

      {variants.length === 0 && existingVariants.length === 0 && !showForm && (
        <p className="text-[11px] text-vous-text-secondary">No hay variantes aun. Agrega las combinaciones de color y talla que existen.</p>
      )}
    </div>
  );
}
