import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePicker } from "@/components/shared/ImagePicker";
import type { Banner, CreateBannerInput } from "@/domain/entities/banner.entity";

interface BannerFormDialogProps {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: CreateBannerInput) => Promise<void>;
}

export function BannerFormDialog({ open, banner, onClose, onSave }: BannerFormDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("Ver Todo");
  const [ctaUrl, setCtaUrl] = useState("/catalogo");
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (banner) {
      setImageUrl(banner.imageUrl);
      setTitle(banner.title);
      setSubtitle(banner.subtitle);
      setCtaText(banner.ctaText);
      setCtaUrl(banner.ctaUrl);
      setActive(banner.active);
      setOrder(banner.order);
    } else {
      setImageUrl("");
      setTitle("");
      setSubtitle("");
      setCtaText("Ver Todo");
      setCtaUrl("/catalogo");
      setActive(true);
      setOrder(0);
    }
  }, [banner, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !title.trim()) return;
    setSaving(true);
    try {
      await onSave({ imageUrl, title, subtitle, ctaText, ctaUrl, active, order });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {banner ? "Editar Banner" : "Nuevo Banner"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Imagen del Banner *</Label>
            <ImagePicker value={imageUrl} onChange={setImageUrl} folder="vous/banners" label="Subir imagen de banner" />
          </div>
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Colección Primavera 2026"
            />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Descubre piezas únicas para tu estilo"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Texto del CTA</Label>
              <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ver Todo" />
            </div>
            <div className="space-y-1">
              <Label>URL del CTA</Label>
              <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/catalogo" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Orden</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} min={0} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
              <Label className="mb-0">Activo</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || !imageUrl.trim()}>
              {saving ? "Guardando..." : banner ? "Guardar cambios" : "Crear banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
