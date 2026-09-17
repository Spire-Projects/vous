import { X } from "lucide-react";
import { clsx } from "clsx";

const PRESET_CLOTHING_COLORS = [
  { name: "Negro", hex: "#1a1a1a" },
  { name: "Blanco", hex: "#ffffff" },
  { name: "Beige", hex: "#E8DCCA" },
  { name: "Gris", hex: "#9E9E9E" },
  { name: "Azul", hex: "#3B82F6" },
  { name: "Azul Marino", hex: "#1E3A5F" },
  { name: "Rojo", hex: "#EF4444" },
  { name: "Borgoña", hex: "#7F1D1D" },
  { name: "Verde", hex: "#22C55E" },
  { name: "Verde Oliva", hex: "#556B2F" },
  { name: "Amarillo", hex: "#EAB308" },
  { name: "Mostaza", hex: "#D4A017" },
  { name: "Rosa", hex: "#F472B6" },
  { name: "Rosa Viejo", hex: "#D8A7B1" },
  { name: "Nude", hex: "#DDBEA9" },
  { name: "Café", hex: "#8B5E3C" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Terracota", hex: "#E2725B" },
  { name: "Lavanda", hex: "#B4A7D6" },
  { name: "Naranja", hex: "#F97316" },
  { name: "Plateado", hex: "#C0C0C0" },
  { name: "Dorado", hex: "#C9A84C" },
];

interface ClothingColorChipsProps {
  selected: string[];
  onChange: (colors: string[]) => void;
}

export function ClothingColorChips({ selected, onChange }: ClothingColorChipsProps) {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((c) => c !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_CLOTHING_COLORS.map((c) => {
        const isActive = selected.includes(c.name);
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => toggle(c.name)}
            className={clsx(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-nav uppercase tracking-wide border rounded-lg transition-all",
              isActive
                ? "bg-black text-white border-black"
                : "bg-white/80 text-vous-text border-vous-border hover:border-black/40"
            )}
            title={c.name}
          >
            <span
              className="w-3 h-3 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: c.hex }}
            />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

const PRESET_SKIN_TONES = [
  { name: "Muy claro", hex: "#F5D0C5" },
  { name: "Claro", hex: "#E8BEAC" },
  { name: "Claro medio", hex: "#D4A373" },
  { name: "Medio", hex: "#C68642" },
  { name: "Medio oscuro", hex: "#8D5524" },
  { name: "Oscuro", hex: "#4E342E" },
  { name: "Muy oscuro", hex: "#3B2219" },
];

interface SkinTonePickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function SkinTonePicker({ value, onChange }: SkinTonePickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {PRESET_SKIN_TONES.map((tone) => (
          <button
            key={tone.hex}
            type="button"
            onClick={() => onChange(tone.hex)}
            className={clsx(
              "group flex flex-col items-center gap-1.5 transition-all",
              value === tone.hex ? "scale-110" : "hover:scale-105"
            )}
            title={tone.name}
          >
            <span
              className={clsx(
                "w-10 h-10 rounded-full border-2 transition-colors",
                value === tone.hex ? "border-black" : "border-transparent group-hover:border-black/30"
              )}
              style={{ backgroundColor: tone.hex }}
            />
            <span className="text-[9px] font-nav uppercase tracking-wider text-vous-text-secondary">
              {tone.name}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Custom HEX</span>
        <input
          type="color"
          value={value || "#E8BEAC"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-vous-border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#E8BEAC"
          className="flex-1 max-w-[120px] text-[11px] font-nav uppercase px-2 py-1 border border-vous-border rounded-lg"
        />
      </div>
    </div>
  );
}

const PRESET_CUTS = [
  "Oversized",
  "Slim-fit",
  "Regular-fit",
  "Relaxed",
  "Crop",
  "Boxy",
  "A-line",
  "Straight",
  "Tapered",
  "Wide-leg",
  "Bootcut",
  "Skinny",
  "High-waist",
  "Mid-rise",
  "Low-rise",
  "Structured",
  "Fluid",
  "Asimétrico",
  "Layered",
  "Peplum",
];

interface CutStyleChipsProps {
  selected: string[];
  onChange: (cuts: string[]) => void;
}

export function CutStyleChips({ selected, onChange }: CutStyleChipsProps) {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((c) => c !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_CUTS.map((cut) => {
        const isActive = selected.includes(cut);
        return (
          <button
            key={cut}
            type="button"
            onClick={() => toggle(cut)}
            className={clsx(
              "px-3 py-1.5 text-[11px] font-nav uppercase tracking-wide border rounded-lg transition-all",
              isActive
                ? "bg-black text-white border-black"
                : "bg-white/80 text-vous-text border-vous-border hover:border-black/40"
            )}
          >
            {cut}
          </button>
        );
      })}
    </div>
  );
}

export function SelectedChips({ items, onRemove }: { items: string[]; onRemove: (item: string) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-nav uppercase tracking-wide bg-black text-white rounded-lg"
        >
          {item}
          <button type="button" onClick={() => onRemove(item)} className="hover:text-red-300">
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  );
}
