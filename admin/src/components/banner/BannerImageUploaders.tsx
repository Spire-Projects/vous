import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/shared/ImagePicker";

interface BannerImageUploadersProps {
  imageUrl: string;
  tabletImageUrl: string;
  mobileImageUrl: string;
  onImageChange: (url: string) => void;
  onTabletImageChange: (url: string) => void;
  onMobileImageChange: (url: string) => void;
}

export function BannerImageUploaders({
  imageUrl,
  tabletImageUrl,
  mobileImageUrl,
  onImageChange,
  onTabletImageChange,
  onMobileImageChange,
}: BannerImageUploadersProps) {
  return (
    <div className="space-y-4 rounded-xl border border-black/10 bg-[#FAF8F5] p-4">
      <div>
        <p className="font-nav text-[11px] font-semibold tracking-[0.2em] uppercase text-black mb-1">
          Imágenes Responsive
        </p>
        <p className="font-sans text-[11px] text-black/50 leading-relaxed">
          Sube una versión por dispositivo. Si no subes tablet o móvil, se usará la imagen de desktop.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <Monitor size={13} className="text-black/60" />
          Imagen Desktop *
        </Label>
        <ImagePicker
          value={imageUrl}
          onChange={onImageChange}
          folder="vous/banners"
          label="Subir imagen desktop (1920×1080 recomendado)"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <Tablet size={13} className="text-black/60" />
          Imagen Tablet <span className="text-black/40 font-sans text-[10px]">(opcional)</span>
        </Label>
        <ImagePicker
          value={tabletImageUrl}
          onChange={onTabletImageChange}
          folder="vous/banners"
          label="Subir imagen tablet (1024×768 recomendado)"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <Smartphone size={13} className="text-black/60" />
          Imagen Mobile <span className="text-black/40 font-sans text-[10px]">(opcional)</span>
        </Label>
        <ImagePicker
          value={mobileImageUrl}
          onChange={onMobileImageChange}
          folder="vous/banners"
          label="Subir imagen mobile (750×1000 recomendado)"
        />
      </div>
    </div>
  );
}
