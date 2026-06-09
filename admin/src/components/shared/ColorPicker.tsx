import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export interface ColorItem { hex: string; name: string; images?: string[]; }

interface Props {
  value: ColorItem[];
  onChange: (colors: ColorItem[]) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  const [hex, setHex] = useState("#000000");
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    onChange([...value, { hex, name: name.trim() }]);
    setName("");
    setHex("#000000");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 border border-vous-border px-2 py-1 bg-white/90 text-[11px] font-nav uppercase tracking-wide">
              <span className="w-3.5 h-3.5 rounded-full border border-vous-border shrink-0" style={{ background: c.hex }} />
              <span>{c.name}</span>
              <button type="button" onClick={() => remove(i)} className="text-vous-text-secondary hover:text-vous-text ml-0.5">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-9 h-9 rounded border border-vous-border cursor-pointer p-0.5 bg-vous-surface"
          title="Elegir color"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del color (ej: Negro)"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={add} disabled={!name.trim()}>
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
}
