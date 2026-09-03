import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { X, Plus, ChevronDown, ChevronRight } from "lucide-react";

export interface ColorItem {
  hex: string;
  name: string;
  images?: string[];
}

interface Props {
  value: ColorItem[];
  onChange: (colors: ColorItem[]) => void;
}

export function ColorVariantPicker({ value, onChange }: Props) {
  const [hex, setHex] = useState("#000000");
  const [name, setName] = useState("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  function add() {
    if (!name.trim()) return;
    if (value.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) return;
    onChange([...value, { hex, name: name.trim(), images: [] }]);
    setName("");
    setHex("#000000");
  }

  function remove(idx: number) {
    if (expandedIdx === idx) setExpandedIdx(null);
    else if (expandedIdx !== null && expandedIdx > idx) setExpandedIdx(expandedIdx - 1);
    onChange(value.filter((_, i) => i !== idx));
  }

  function updateImages(idx: number, images: string[]) {
    const next = [...value];
    next[idx] = { ...next[idx], images };
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="space-y-1.5">
          {value.map((c, i) => {
            const isExpanded = expandedIdx === i;
            const imgCount = c.images?.length ?? 0;
            return (
              <div key={i} className="border border-vous-border bg-vous-surface">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <span className="w-5 h-5 rounded-full border border-vous-border shrink-0" style={{ background: c.hex }} />
                  <button
                    type="button"
                    onClick={() => setExpandedIdx(isExpanded ? null : i)}
                    className="flex-1 flex items-center gap-1 text-[12px] font-nav uppercase tracking-wide hover:text-vous-text text-left"
                  >
                    {c.name}
                    {imgCount > 0 && (
                      <span className="text-[10px] font-sans text-vous-text-secondary normal-case font-normal">
                        ({imgCount} foto{imgCount !== 1 ? "s" : ""})
                      </span>
                    )}
                    {isExpanded ? <ChevronDown size={12} className="ml-auto text-vous-text-secondary" /> : <ChevronRight size={12} className="ml-auto text-vous-text-secondary" />}
                  </button>
                  <button type="button" onClick={() => remove(i)} className="text-vous-text-secondary hover:text-red-700 shrink-0">
                    <X size={13} />
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-3 py-2 border-t border-white/40 bg-white/90/30 space-y-2">
                    <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary">
                      Fotos para color {c.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(c.images ?? []).map((img, j) => (
                        <div key={j} className="relative w-12 h-12 border border-vous-border">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => updateImages(i, (c.images ?? []).filter((_, k) => k !== j))}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center"
                          >×</button>
                        </div>
                      ))}
                    </div>
                    <ImagePicker
                      value=""
                      onChange={(url) => updateImages(i, [...(c.images ?? []), url])}
                      folder="vous/products"
                      label="Agregar foto"
                      aspect="square"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-9 h-9 rounded border border-vous-border cursor-pointer p-0.5 bg-vous-surface shrink-0"
          title="Elegir color"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del color (ej: Negro)"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={!name.trim()} className="shrink-0 gap-1">
          <Plus size={13} /> Agregar
        </Button>
      </div>
      <p className="text-[10px] text-vous-text-secondary">Cada color puede tener sus propias fotos. Las fotos se mostrarán cuando el cliente seleccione ese color.</p>
    </div>
  );
}
