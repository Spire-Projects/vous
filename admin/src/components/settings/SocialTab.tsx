import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function SocialRow({
  label,
  url,
  setUrl,
  active,
  setActive,
}: {
  label: string;
  url: string;
  setUrl: (v: string) => void;
  active: boolean;
  setActive: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex-1 min-w-0">
        <Label>{label}</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={`https://${label.toLowerCase()}.com/...`} />
      </div>
      <div className="flex items-center gap-2 sm:pt-5 shrink-0">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="accent-vous-gold w-4 h-4"
        />
        <span className="font-nav text-[12px] uppercase tracking-wide text-vous-text">
          Activo
        </span>
      </div>
    </div>
  );
}

interface SocialTabProps {
  instagramUrl: string; setInstagramUrl: (v: string) => void; instagramActive: boolean; setInstagramActive: (v: boolean) => void;
  tiktokUrl: string; setTiktokUrl: (v: string) => void; tiktokActive: boolean; setTiktokActive: (v: boolean) => void;
  ubicacionUrl: string; setUbicacionUrl: (v: string) => void; ubicacionActive: boolean; setUbicacionActive: (v: boolean) => void;
}

export function SocialTab({
  instagramUrl, setInstagramUrl, instagramActive, setInstagramActive,
  tiktokUrl, setTiktokUrl, tiktokActive, setTiktokActive,
  ubicacionUrl, setUbicacionUrl, ubicacionActive, setUbicacionActive,
}: SocialTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Redes Sociales</h2>
      <div className="space-y-4">
        <SocialRow label="Instagram" url={instagramUrl} setUrl={setInstagramUrl} active={instagramActive} setActive={setInstagramActive} />
        <SocialRow label="TikTok" url={tiktokUrl} setUrl={setTiktokUrl} active={tiktokActive} setActive={setTiktokActive} />
        <SocialRow label="Ubicación (Google Maps)" url={ubicacionUrl} setUrl={setUbicacionUrl} active={ubicacionActive} setActive={setUbicacionActive} />
      </div>
    </div>
  );
}
