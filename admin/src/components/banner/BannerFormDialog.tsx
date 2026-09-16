import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BannerImageUploaders } from "./BannerImageUploaders";
import { BannerPreview } from "./BannerPreview";
import { useCategories } from "@/hooks/useCategories";
import { Eye, Edit3 } from "lucide-react";
import type { Banner, CreateBannerInput } from "@/domain/entities/banner.entity";

interface BannerFormDialogProps {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: CreateBannerInput) => Promise<void>;
}

export function BannerFormDialog({ open, banner, onClose, onSave }: BannerFormDialogProps) {
  const { categories } = useCategories();
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [imageUrl, setImageUrl] = useState("");
  const [tabletImageUrl, setTabletImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("Ver Todo");
  const [ctaVisible, setCtaVisible] = useState(true);
  const [categorySlug, setCategorySlug] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setTab("form");
    setImageUrl(banner?.imageUrl ?? "");
    setTabletImageUrl(banner?.tabletImageUrl ?? "");
    setMobileImageUrl(banner?.mobileImageUrl ?? "");
    setTitle(banner?.title ?? "");
    setSubtitle(banner?.subtitle ?? "");
    setCtaText(banner?.ctaText || "Ver Todo");
    setCtaVisible(banner?.ctaVisible !== false);
    setCategorySlug(banner?.categorySlug ?? "");
    setActive(banner?.active ?? true);
  }, [banner, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const ctaUrl = categorySlug ? `/catalogo?categoria=${categorySlug}` : "/catalogo";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        imageUrl, tabletImageUrl: tabletImageUrl.trim() || undefined,
        mobileImageUrl: mobileImageUrl.trim() || undefined,
        title, subtitle, ctaText: ctaText.trim() || "Ver Todo",
        ctaUrl, ctaVisible, categorySlug: categorySlug || undefined,
        active, order: banner?.order ?? 0,
      });
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-vous-border">
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {banner ? "Editar Banner" : "Nuevo Banner"}
          </DialogTitle>
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded border border-vous-border">
            <button type="button" onClick={() => setTab("form")} className={`flex items-center gap-1 px-2 py-1 text-[11px] font-nav rounded ${tab === "form" ? "bg-white text-vous-text shadow-xs font-medium" : "text-vous-text-secondary"}`}>
              <Edit3 size={12} /> Edición
            </button>
            <button type="button" onClick={() => setTab("preview")} className={`flex items-center gap-1 px-2 py-1 text-[11px] font-nav rounded ${tab === "preview" ? "bg-white text-vous-text shadow-xs font-medium" : "text-vous-text-secondary"}`}>
              <Eye size={12} /> Vista Previa
            </button>
          </div>
        </DialogHeader>

        {tab === "preview" ? (
          <div className="py-4">
            <BannerPreview title={title} subtitle={subtitle} imageUrl={imageUrl} ctaText={ctaText} ctaVisible={ctaVisible} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <BannerImageUploaders
              imageUrl={imageUrl} tabletImageUrl={tabletImageUrl} mobileImageUrl={mobileImageUrl}
              onImageChange={setImageUrl} onTabletImageChange={setTabletImageUrl} onMobileImageChange={setMobileImageUrl}
            />
            <div className="space-y-1">
              <Label>Título *</Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Colección Primavera 2026" />
            </div>
            <div className="space-y-1">
              <Label>Subtítulo</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Descubre piezas únicas para tu estilo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Texto del Botón CTA</Label>
                <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ver Todo" disabled={!ctaVisible} />
              </div>
              <div className="space-y-1">
                <Label>Categoría de Redirección</Label>
                <Select value={categorySlug} onValueChange={setCategorySlug} disabled={!ctaVisible}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar (opcional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría (/catalogo)</SelectItem>
                    {categories.map((c) => (<SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-2 pb-1 border-t border-vous-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={ctaVisible} onCheckedChange={(v) => setCtaVisible(v === true)} />
                <span className="font-nav text-[12px] text-vous-text">Mostrar botón CTA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
                <span className="font-nav text-[12px] text-vous-text">Banner activo</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-vous-border">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={saving || !imageUrl.trim() || !title.trim()}>
                {saving ? "Guardando..." : banner ? "Guardar cambios" : "Crear banner"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
