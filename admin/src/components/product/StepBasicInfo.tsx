import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-nav text-[10px] uppercase tracking-widest text-vous-text-secondary border-b border-white/40 pb-1 mb-1">
      {children}
    </p>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-vous-text-secondary leading-relaxed mb-2">{children}</p>;
}

interface Props {
  name: string; slug: string; description: string; detail: string; categoryId: string;
  categories: { id: string; name: string }[];
  onNameChange: (v: string) => void; onSlugChange: (v: string) => void;
  onDescriptionChange: (v: string) => void; onDetailChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

export function StepBasicInfo({ name, slug, description, detail, categoryId, categories, onNameChange, onSlugChange, onDescriptionChange, onDetailChange, onCategoryChange }: Props) {
  return (
    <section className="space-y-3">
      <SectionTitle>¿Qué producto es?</SectionTitle>
      <HelpText>Nombre y detalle son obligatorios. El detalle describe la prenda al cliente.</HelpText>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Nombre del producto *</Label>
          <Input required value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="ej: Baggy Dad Jeans" />
        </div>
        <div className="space-y-1">
          <Label>Slug (URL) *</Label>
          <Input required value={slug} onChange={(e) => onSlugChange(e.target.value)} placeholder="nombre-del-producto" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Categoría *</Label>
        <select required value={categoryId} onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full h-9 rounded border border-vous-border bg-vous-surface px-3 text-sm font-sans">
          <option value="" disabled>Seleccionar categoría…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <Label>Descripción breve</Label>
        <Textarea rows={2} value={description} onChange={(e) => onDescriptionChange(e.target.value)} placeholder="Una descripción corta del producto…" />
      </div>
      <div className="space-y-1">
        <Label>Detalle completo *</Label>
        <Textarea required rows={4} value={detail} onChange={(e) => onDetailChange(e.target.value)} placeholder="Descripción detallada que verá el cliente. Incluye características, materiales destacados, ocasiones de uso…" />
      </div>
    </section>
  );
}
