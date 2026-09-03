import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImagePicker } from "@/components/shared/ImagePicker";

interface BrandTabProps {
  logoUrl: string;
  setLogoUrl: (v: string) => void;
  storeName: string;
  setStoreName: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
}

export function BrandTab({
  logoUrl, setLogoUrl,
  storeName, setStoreName,
  tagline, setTagline,
}: BrandTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Identidad de Marca</h2>
      <div className="space-y-1">
        <Label>Logo del sitio</Label>
        <ImagePicker value={logoUrl} onChange={setLogoUrl} folder="vous/logos" label="Subir logo" aspect="logo" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Nombre de la tienda</Label>
          <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Tagline</Label>
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Moda urbana contemporánea" />
        </div>
      </div>
    </div>
  );
}
