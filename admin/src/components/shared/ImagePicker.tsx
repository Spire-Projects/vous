import { useRef, useState, useCallback, type DragEvent } from "react";
import { uploadImageToCloudinary } from "@/utils/cloudinary-upload";
import { ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const ACCEPTED_FORMATS = "image/png,image/jpeg,image/webp,image/svg+xml";
const ACCEPTED_LABEL = "PNG, JPG, WebP, SVG";
const MAX_FILE_SIZE_MB = 5;

function validateFile(file: File): string | null {
  if (!file.type.match(/^image\//)) return "El archivo debe ser una imagen.";
  if (!ACCEPTED_FORMATS.split(",").includes(file.type)) {
    return `Formato no permitido. Usá: ${ACCEPTED_LABEL}.`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB.`;
  }
  return null;
}

export function ImagePicker({ value, onChange, folder = "vous/uploads", label = "Subir imagen", aspect = "video" }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const upload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      setUploading(true);
      try {
        const url = await uploadImageToCloudinary(file, folder);
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir la imagen.");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      const file = e.dataTransfer.files?.[0];
      if (file) await upload(file);
    },
    [upload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [upload],
  );

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        onChange={handleFileSelect}
        className="hidden"
      />
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
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative w-full max-w-sm border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-center font-nav text-[11px] uppercase tracking-wide ${
            isDragging
              ? "border-vous-black bg-vous-cream text-vous-black"
              : "border-vous-border text-vous-gray-500 hover:border-vous-black/40 hover:bg-vous-cream/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-vous-black" />
              <span>Subiendo imagen...</span>
            </>
          ) : (
            <>
              {isDragging ? (
                <UploadCloud size={24} className="text-vous-black" />
              ) : (
                <ImageIcon size={20} />
              )}
              <span>{isDragging ? "Soltá la imagen aquí" : label}</span>
              <span className="normal-case text-[10px] tracking-normal text-vous-gray-400 max-w-[220px] leading-tight">
                Formatos: {ACCEPTED_LABEL}. Tamaño máximo: {MAX_FILE_SIZE_MB} MB.
              </span>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="text-red-600 text-xs">{error}</p>
      )}
    </div>
  );
}
