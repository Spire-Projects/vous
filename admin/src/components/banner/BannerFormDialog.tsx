import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { useCategories } from "@/hooks/useCategories";
import type { Banner, CreateBannerInput } from "@/domain/entities/banner.entity";

interface BannerFormDialogProps {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: CreateBannerInput) => Promise<void>;
}

export function BannerFormDialog({ open, banner, onClose, onSave }: BannerFormDialogProps) {
  const { categories } = useCategories();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (banner) {
      setImageUrl(banner.imageUrl);
      setTitle(banner.title);
      setSubtitle(banner.subtitle);
      setCategorySlug(banner.categorySlug ?? "");
      setActive(banner.active);
      setOrder(banner.order);
    } else {
      setImageUrl("");
      setTitle("");
      setSubtitle("");
      setCategorySlug("");
      setActive(true);
      setOrder(0);
    }
  }, [banner, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const ctaUrl = categorySlug
    ? `/catalogo?categoria=${categorySlug}`
    : "/catalogo";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        imageUrl,
        title,
        subtitle,
        ctaText: "Ver Todo",
        ctaUrl,
        categorySlug: categorySlug || undefined,
        active,
        order,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {banner ? "Editar Banner" : "Nuevo Banner"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Imagen del Banner *</Label>
            <ImagePicker
              value={imageUrl}
              onChange={setImageUrl}
              folder="vous/banners"
              label="Subir imagen de banner"
            />
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
          <div className="space-y-1">
            <Label>Categoría del banner</Label>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoría</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categorySlug && (
              <p className="text-[11px] text-vous-gold font-mono mt-1">
                {ctaUrl}
              </p>
            )}
            <p className="text-[11px] text-vous-gray font-sans">
              El banner redirige a esta categoría del catálogo al hacer click.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              checked={active}
              onCheckedChange={(v) => setActive(v === true)}
            />
            <Label className="mb-0">Activo</Label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || !imageUrl.trim()}
            >
              {saving
                ? "Guardando..."
                : banner
                  ? "Guardar cambios"
                  : "Crear banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
