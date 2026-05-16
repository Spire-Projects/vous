import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "@/utils/cloudinary-upload";
import { ImageIcon, Loader2 } from "lucide-react";

interface CoverImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function CoverImagePicker({ value, onChange }: CoverImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch {
      alert("Error al subir imagen. Verifica la configuración de Cloudinary.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden border border-vous-border">
          <img src={value} alt="Portada" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5"
          >
            Eliminar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-dashed border-vous-border px-4 py-3 text-vous-gray hover:border-vous-black hover:text-vous-black transition-colors font-nav text-[11px] uppercase tracking-wide"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
          {uploading ? "Subiendo..." : "Subir imagen de portada"}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <input
        type="url"
        placeholder="O pega una URL de imagen..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-vous-border px-3 py-2 text-[13px] font-sans focus:outline-none focus:border-vous-black"
      />
    </div>
  );
}
