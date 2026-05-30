import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChipInputProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ChipInput({ value, onChange, placeholder = "Escribir y presionar Enter…" }: ChipInputProps) {
  const [text, setText] = useState("");

  function add(input: string) {
    const parts = input
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const existing = new Set(value.map((v) => v.toLowerCase()));
    const unique = parts.filter((p) => !existing.has(p.toLowerCase()));
    if (unique.length > 0) onChange([...value, ...unique]);
    setText("");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, i) => (
            <span
              key={item + i}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-nav uppercase tracking-wide bg-vous-cream border border-vous-border"
            >
              {item}
              <button type="button" onClick={() => remove(i)} className="text-vous-gray hover:text-vous-black ml-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={text}
        onChange={(e) => {
          const v = e.target.value;
          if (v.includes(",") || v.includes(";") || v.includes("\n")) {
            add(v);
          } else {
            setText(v);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(text);
          }
        }}
        onBlur={() => { if (text.trim()) add(text); }}
        placeholder={placeholder}
      />
    </div>
  );
}
