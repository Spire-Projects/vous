import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "@/utils/cloudinary-upload";
import { ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspect?: "video" | "square" | "logo";
}

const ASPECT_CLASSES: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  logo: "h-[80px]",
};

export function ImagePicker({ value, onChange, folder = "vous/uploads", label = "Subir imagen", aspect = "video" }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file, folder);
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
        <div className={`relative w-full max-w-sm overflow-hidden border border-vous-border ${ASPECT_CLASSES[aspect] ?? "aspect-video"} ${aspect === "logo" ? "bg-white flex items-center justify-center" : ""}`}>
          <img src={value} alt="Preview" className={`${aspect === "logo" ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"}`} />
            <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 text-xs px-2 py-0.5 h-auto"
          >
            Eliminar
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border-dashed font-nav text-[11px] uppercase tracking-wide"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
          {uploading ? "Subiendo..." : label}
        </Button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Input
        type="url"
        placeholder="O pega una URL de imagen..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
