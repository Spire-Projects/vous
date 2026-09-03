import { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepSizesProps {
  sizes: string[];
  configSizes: { id: string; name: string; isActive: boolean }[];
  onSizesChange: (v: string[]) => void;
  onCreateConfigSize?: (name: string) => Promise<void>;
}

export function StepSizes({ sizes, configSizes, onSizesChange, onCreateConfigSize }: StepSizesProps) {
  const [custom, setCustom] = useState("");

  const activeConfig = configSizes.filter((s) => s.isActive);

  function toggle(name: string) {
    if (sizes.includes(name)) {
      onSizesChange(sizes.filter((s) => s !== name));
    } else {
      onSizesChange([...sizes, name]);
    }
  }

  async function addCustom() {
    const val = custom.trim().toUpperCase();
    if (!val || sizes.includes(val)) return;
    onSizesChange([...sizes, val]);
    setCustom("");
    // Auto-save to global clothing config so other products can use it
    if (onCreateConfigSize) {
      try {
        await onCreateConfigSize(val);
      } catch {
        // silent fail — the size is still added to the product
      }
    }
  }

  return (
    <section className="space-y-3">
      <p className="font-nav text-[10px] uppercase tracking-widest text-vous-text-secondary border-b border-white/40 pb-1 mb-1">
        Tallas disponibles
      </p>
      <p className="text-[11px] text-vous-text-secondary leading-relaxed mb-2">
        Selecciona las tallas configuradas o agrega personalizadas. Si el producto no tiene tallas, deja todo vacio.
      </p>

      {/* Configured sizes */}
      {activeConfig.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary">Tallas predefinidas</p>
          <div className="flex flex-wrap gap-2">
            {activeConfig.map((s) => {
              const selected = sizes.includes(s.name);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.name)}
                  className={`min-w-[40px] h-10 px-3 font-nav text-[11px] tracking-wider border rounded-lg transition-colors ${
                    selected
                      ? "bg-black text-white border-black"
                      : "border-black/10 text-black/50 hover:border-black/30 hover:text-black"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom sizes */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary">Personalizadas</p>
        <div className="flex flex-wrap gap-2">
          {sizes
            .filter((s) => !activeConfig.some((c) => c.name === s))
            .map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-nav uppercase tracking-wide bg-white/90 border border-vous-border"
              >
                {s}
                {onCreateConfigSize && <span title="Guardada en configuracion global"><Sparkles size={10} className="text-vous-gold" /></span>}
                <button type="button" onClick={() => toggle(s)} className="text-vous-text-secondary hover:text-vous-text ml-0.5">
                  <X size={11} />
                </button>
              </span>
            ))}
        </div>
        <div className="flex gap-1.5">
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Ej: XXL, TALLA UNICA..."
            className="h-8 text-[11px] w-48"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={addCustom}>
            <Plus size={12} /> Agregar
          </Button>
        </div>
        {onCreateConfigSize && (
          <p className="text-[9px] text-vous-text-secondary">
            Las tallas personalizadas se guardaran automaticamente en la configuracion global de ropa para que otros productos las puedan usar.
          </p>
        )}
      </div>
    </section>
  );
}
