import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ColorItem } from "@/components/shared/ColorPicker";

interface VariantRow {
  color: string;
  colorHex: string;
  size: string;
}

export interface VariantData {
  color: string | null;
  colorHex: string | null;
  size: string | null;
  stock: number;
  sku: string;
}

function generateCombinations(colors: ColorItem[], sizes: string[]): VariantRow[] {
  if (colors.length === 0 && sizes.length === 0) return [];
  const cList = colors.length > 0 ? colors : [{ hex: "#000000", name: "" }];
  const sList = sizes.length > 0 ? sizes : [""];
  const combos: VariantRow[] = [];
  for (const c of cList) {
    for (const s of sList) {
      combos.push({ color: c.name, colorHex: c.hex, size: s });
    }
  }
  return combos;
}

interface VariantGridProps {
  colors: ColorItem[];
  sizes: string[];
  variants: Record<string, VariantData>;
  onChange: (key: string, data: VariantData) => void;
}

export function VariantGrid({ colors, sizes, variants, onChange }: VariantGridProps) {
  const rows = useMemo(() => generateCombinations(colors, sizes), [colors, sizes]);

  if (rows.length === 0) return null;

  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  return (
    <div className="space-y-2 border border-vous-border bg-white overflow-hidden">
      <div className="bg-vous-cream px-3 py-2 border-b border-vous-border">
        <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray">
          Variantes ({rows.length} combinaciones)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-vous-border bg-vous-bg/50">
              {hasColors && <th className="text-left px-3 py-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-gray">Color</th>}
              {hasSizes && <th className="text-left px-3 py-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-gray">Talla</th>}
              <th className="text-left px-3 py-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-gray w-24">Stock</th>
              <th className="text-left px-3 py-1.5 font-nav text-[10px] uppercase tracking-wider text-vous-gray w-36">SKU</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const key = `${row.color}::${row.size}`;
              const v = variants[key] ?? { color: row.color || null, colorHex: row.colorHex || null, size: row.size || null, stock: 0, sku: "" };
              return (
                <tr key={i} className="border-b border-vous-border/50 hover:bg-vous-bg/30">
                  {hasColors && (
                    <td className="px-3 py-1">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-vous-border shrink-0" style={{ background: row.colorHex }} />
                        <span className="text-[11px] font-nav uppercase">{row.color}</span>
                      </span>
                    </td>
                  )}
                  {hasSizes && (
                    <td className="px-3 py-1">
                      <span className="text-[11px] font-nav uppercase">{row.size}</span>
                    </td>
                  )}
                  <td className="px-3 py-1">
                    <Input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => onChange(key, { ...v, stock: Math.max(0, Number(e.target.value) || 0) })}
                      className="h-7 text-[11px] w-full"
                    />
                  </td>
                  <td className="px-3 py-1">
                    <Input
                      value={v.sku}
                      onChange={(e) => onChange(key, { ...v, sku: e.target.value })}
                      placeholder="opcional"
                      className="h-7 text-[11px] w-full"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 border-t border-vous-border bg-vous-bg/30 flex items-center gap-2">
        <Label className="text-[10px] font-nav uppercase tracking-wider text-vous-gray shrink-0">Stock global:</Label>
        <Input
          type="number"
          min={0}
          placeholder="Aplicar a todos"
          className="h-7 text-[11px] w-32"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const val = Math.max(0, Number((e.target as HTMLInputElement).value) || 0);
              const updated: Record<string, VariantData> = {};
              for (const row of rows) {
                const key = `${row.color}::${row.size}`;
                const existing = variants[key] ?? { color: row.color || null, colorHex: row.colorHex || null, size: row.size || null, stock: 0, sku: "" };
                updated[key] = { ...existing, stock: val };
              }
              Object.entries(updated).forEach(([k, d]) => onChange(k, d));
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
