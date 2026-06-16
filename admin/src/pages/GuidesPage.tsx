import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Palette, Shirt } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useStyleGuides } from "@/hooks/useStyleGuides";
import type { StyleGuide, CreateStyleGuideInput, StyleGuideType, StyleGuideGender } from "@/domain/entities/style-guide.entity";

const TYPE_LABELS: Record<StyleGuideType, string> = {
  skinTone: "Tono de Piel",
  bodyType: "Tipo de Cuerpo",
};

const GENDER_LABELS: Record<StyleGuideGender, string> = {
  unisex: "Unisex",
  men: "Hombre",
  women: "Mujer",
};

export function GuidesPage() {
  const { guides, loading, create, update, remove, toggleActive } = useStyleGuides();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StyleGuide | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const skinCount = guides.filter((g) => g.type === "skinTone").length;
  const bodyCount = guides.filter((g) => g.type === "bodyType").length;
  const activeCount = guides.filter((g) => g.active).length;

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(guide: StyleGuide) { setEditing(guide); setDialogOpen(true); }

  async function handleSave(data: CreateStyleGuideInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
    setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Guías de Estilo"
        subtitle="Configura guías de colorimetría y tipos de cuerpo para recomendaciones."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Nueva guía</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={String(guides.length)} />
        <StatCard label="Tono de Piel" value={String(skinCount)} icon={<Palette size={16} />} />
        <StatCard label="Tipo de Cuerpo" value={String(bodyCount)} icon={<Shirt size={16} />} />
        <StatCard label="Activas" value={String(activeCount)} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">Cargando guías...</div>
        ) : guides.length === 0 ? (
          <div className="p-12 text-center text-vous-text-secondary font-sans text-sm">No hay guías. Crea la primera.</div>
        ) : (
          <div className="divide-y divide-white/30 overflow-x-auto">
            {guides.map((guide) => (
              <div key={guide.id} className="flex items-start gap-3 p-4 hover:bg-amber-50/30 transition-colors">
                <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-vous-border bg-vous-surface">
                  {guide.imageUrl ? (
                    <img src={guide.imageUrl} alt={guide.name} className="w-full h-full object-cover" />
                  ) : guide.colorHex ? (
                    <div className="w-full h-full" style={{ backgroundColor: guide.colorHex }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-vous-text-secondary text-[10px]">{guide.type === "skinTone" ? "P" : "C"}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-nav text-[13px] font-semibold text-vous-text">{guide.name}</p>
                    <Badge variant={guide.active ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
                      {guide.active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-vous-text-secondary font-sans line-clamp-1">{guide.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-nav text-vous-text-muted">
                    <span>{TYPE_LABELS[guide.type]}</span>
                    <span>·</span>
                    <span>{GENDER_LABELS[guide.gender]}</span>
                    <span>·</span>
                    <span>Orden {guide.order}</span>
                    {guide.recommendedColors.length > 0 && (
                      <><span>·</span><span>{guide.recommendedColors.length} colores</span></>
                    )}
                    {guide.recommendedAttributes.length > 0 && (
                      <><span>·</span><span>{guide.recommendedAttributes.length} cortes</span></>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(guide.id, guide.active)} title={guide.active ? "Desactivar" : "Activar"}>
                    {guide.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(guide)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(guide.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GuideFormDialog open={dialogOpen} guide={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar guía?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}

/* ── Form Dialog ─────────────────────────────────────────────────────────── */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { ChipInput } from "@/components/shared/ChipInput";

interface GuideFormDialogProps {
  open: boolean;
  guide: StyleGuide | null;
  onClose: () => void;
  onSave: (data: CreateStyleGuideInput) => Promise<void>;
}

function GuideFormDialog({ open, guide, onClose, onSave }: GuideFormDialogProps) {
  const [type, setType] = useState<StyleGuideType>("skinTone");
  const [gender, setGender] = useState<StyleGuideGender>("unisex");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [recommendedColors, setRecommendedColors] = useState<string[]>([]);
  const [recommendedAttributes, setRecommendedAttributes] = useState<string[]>([]);
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (guide) {
      setType(guide.type);
      setGender(guide.gender);
      setName(guide.name);
      setDescription(guide.description);
      setImageUrl(guide.imageUrl);
      setColorHex(guide.colorHex ?? "");
      setRecommendedColors(guide.recommendedColors);
      setRecommendedAttributes(guide.recommendedAttributes);
      setOrder(guide.order);
      setActive(guide.active);
    } else {
      setType("skinTone");
      setGender("unisex");
      setName("");
      setDescription("");
      setImageUrl("");
      setColorHex("");
      setRecommendedColors([]);
      setRecommendedAttributes([]);
      setOrder(0);
      setActive(true);
    }
  }, [guide, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        type, gender, name, description, imageUrl,
        colorHex: colorHex || undefined,
        recommendedColors,
        recommendedAttributes,
        order,
        active,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {guide ? "Editar Guía" : "Nueva Guía"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v: StyleGuideType) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="skinTone">Tono de Piel</SelectItem>
                  <SelectItem value="bodyType">Tipo de Cuerpo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Género</Label>
              <Select value={gender} onValueChange={(v: StyleGuideGender) => setGender(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unisex">Unisex</SelectItem>
                  <SelectItem value="men">Hombre</SelectItem>
                  <SelectItem value="women">Mujer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Nombre *</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Piel Clara" />
          </div>
          <div className="space-y-1">
            <Label>Descripción</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción de la guía..." />
          </div>
          <div className="space-y-1">
            <Label>Imagen</Label>
            <ImagePicker value={imageUrl} onChange={setImageUrl} folder="vous/guides" label="Subir imagen" />
          </div>
          {type === "skinTone" && (
            <div className="space-y-1">
              <Label>Color HEX del tono de piel</Label>
              <div className="flex gap-2">
                <Input value={colorHex} onChange={(e) => setColorHex(e.target.value)} placeholder="#E8BEAC" />
                {colorHex && <div className="w-10 h-10 rounded-lg border border-black/10" style={{ backgroundColor: colorHex }} />}
              </div>
            </div>
          )}
          <div className="space-y-1">
            <Label>Colores de ropa recomendados</Label>
            <ChipInput value={recommendedColors} onChange={setRecommendedColors} placeholder="Ej: Negro, Blanco, Beige..." />
          </div>
          <div className="space-y-1">
            <Label>Cortes / Estilos recomendados</Label>
            <ChipInput value={recommendedAttributes} onChange={setRecommendedAttributes} placeholder="Ej: Oversized, Slim-fit, Recto..." />
          </div>
          <div className="space-y-1">
            <Label>Orden</Label>
            <Input type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} id="sg-active" />
            <Label htmlFor="sg-active" className="mb-0">Activa</Label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "Guardando..." : guide ? "Guardar cambios" : "Crear guía"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
