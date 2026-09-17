import { useState } from "react";
import { X, Plus } from "lucide-react";
import { ImagePicker } from "./ImagePicker";

interface MultiImagePickerProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}

export function MultiImagePicker({ values, onChange, folder = "vous/guides", label = "Agregar imagen" }: MultiImagePickerProps) {
  const [adding, setAdding] = useState(false);

  function add(url: string) {
    if (url && !values.includes(url)) {
      onChange([...values, url]);
    }
    setAdding(false);
  }

  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {values.map((url, i) => (
            <div key={`${url}-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-vous-border group">
              <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="max-w-xs">
          <ImagePicker
            value=""
            onChange={add}
            folder={folder}
            label={label}
            aspect="square"
          />
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="mt-2 text-[11px] font-nav text-vous-text-secondary hover:text-vous-text"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-vous-border rounded-xl text-[11px] font-nav text-vous-text-secondary hover:text-vous-text hover:border-vous-black/40 hover:bg-amber-50/50 transition-colors"
        >
          <Plus size={12} />
          {label}
        </button>
      )}
    </div>
  );
}
