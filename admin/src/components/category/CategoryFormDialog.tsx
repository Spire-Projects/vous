import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePicker } from "@/components/shared/ImagePicker";
import type { Category, CreateCategoryInput } from "@/domain/entities/category.entity";
import { toSlug } from "@/utils/slug";

interface Props {
  open: boolean;
  category: Category | null;
  nextOrder: number;
  onClose: () => void;
  onSave: (data: CreateCategoryInput) => Promise<void>;
}

export function CategoryFormDialog({ open, category, nextOrder, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name); setSlug(category.slug);
      setDescription(category.description ?? ""); setImage(category.image ?? "");
      setBanner(category.banner ?? ""); setIsActive(category.isActive); setSlugManual(true);
    } else {
      setName(""); setSlug(""); setDescription(""); setImage(""); setBanner(""); setIsActive(true); setSlugManual(false);
    }
  }, [category, open]);

  function handleNameChange(v: string) {
    setName(v);
    if (!slugManual) setSlug(toSlug(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name, slug,
        description: description || undefined,
        image: image || undefined,
        banner: banner || undefined,
        isActive,
        sortOrder: category?.sortOrder ?? nextOrder,
      });
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label>Nombre *</Label>
              <Input required value={name} onChange={(e) => handleNameChange(e.target.value)} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Slug *</Label>
              <Input required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} placeholder="nombre-categoria" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Descripción</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1">
            <Label>Imagen de categoría</Label>
            <ImagePicker value={image} onChange={setImage} folder="vous/categories" label="Subir imagen" aspect="square" />
          </div>
          <div className="space-y-1">
            <Label>Banner</Label>
            <ImagePicker value={banner} onChange={setBanner} folder="vous/banners" label="Subir banner" aspect="video" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
            <Label className="mb-0">Activa (visible en catálogo y landing)</Label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando..." : category ? "Guardar cambios" : "Crear categoría"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
