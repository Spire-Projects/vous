import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUGGESTED_KEYS = ["Tela", "Corte", "Pretina", "Largo"];

interface Props {
  value: Record<string, string>;
  onChange: (attrs: Record<string, string>) => void;
}

export function AttributeEditor({ value, onChange }: Props) {
  const [customKey, setCustomKey] = useState("");

  const entries = Object.entries(value);
  const unusedSuggestions = SUGGESTED_KEYS.filter((k) => !(k in value));

  function addSuggested(key: string) {
    if (!key || key in value) return;
    onChange({ ...value, [key]: "" });
  }

  function addCustom() {
    const k = customKey.trim();
    if (!k || k in value) return;
    onChange({ ...value, [k]: "" });
    setCustomKey("");
  }

  function updateValue(key: string, val: string) {
    onChange({ ...value, [key]: val });
  }

  function remove(key: string) {
    const next = { ...value };
    delete next[key];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, val]) => (
        <div key={key} className="flex gap-2 items-center">
          <Input
            value={key}
            readOnly
            className="w-32 bg-vous-bg text-[12px] shrink-0"
          />
          <Input
            value={val}
            onChange={(e) => updateValue(key, e.target.value)}
            placeholder={`Valor de ${key}`}
            className="flex-1 text-[12px]"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(key)}
            className="shrink-0"
          >
            <X size={13} />
          </Button>
        </div>
      ))}

      <div className="flex gap-2 flex-wrap mt-1">
        {unusedSuggestions.length > 0 && (
          <Select onValueChange={addSuggested}>
            <SelectTrigger className="w-40 h-8 text-[11px]">
              <SelectValue placeholder="Sugerido…" />
            </SelectTrigger>
            <SelectContent>
              {unusedSuggestions.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-1.5 flex-1 min-w-0">
          <Input
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            placeholder="Atributo personalizado"
            className="flex-1 h-8 text-[11px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={addCustom}
          >
            <Plus size={12} /> Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
