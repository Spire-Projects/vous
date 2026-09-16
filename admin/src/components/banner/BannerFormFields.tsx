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
import type { Category } from "@/domain/entities/category.entity";

interface BannerFormFieldsProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaVisible: boolean;
  categorySlug: string;
  active: boolean;
  categories: Category[];
  onTitleChange: (v: string) => void;
  onSubtitleChange: (v: string) => void;
  onCtaTextChange: (v: string) => void;
  onCtaVisibleChange: (v: boolean) => void;
  onCategorySlugChange: (v: string) => void;
  onActiveChange: (v: boolean) => void;
}

export function BannerFormFields({
  title,
  subtitle,
  ctaText,
  ctaVisible,
  categorySlug,
  active,
  categories,
  onTitleChange,
  onSubtitleChange,
  onCtaTextChange,
  onCtaVisibleChange,
  onCategorySlugChange,
  onActiveChange,
}: BannerFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Título *</Label>
        <Input
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Colección Primavera 2026"
        />
      </div>

      <div className="space-y-1">
        <Label>Subtítulo</Label>
        <Input
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="Descubre piezas únicas para tu estilo"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Texto del Botón CTA</Label>
          <Input
            value={ctaText}
            onChange={(e) => onCtaTextChange(e.target.value)}
            placeholder="Ver Todo"
            disabled={!ctaVisible}
          />
        </div>

        <div className="space-y-1">
          <Label>Categoría de Redirección</Label>
          <Select
            value={categorySlug}
            onValueChange={onCategorySlugChange}
            disabled={!ctaVisible}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin categoría (/catalogo)</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-2 pb-1 border-t border-vous-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={ctaVisible}
            onCheckedChange={(v) => onCtaVisibleChange(v === true)}
          />
          <span className="font-nav text-[12px] text-vous-text">
            Mostrar botón CTA
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={active}
            onCheckedChange={(v) => onActiveChange(v === true)}
          />
          <span className="font-nav text-[12px] text-vous-text">
            Banner activo
          </span>
        </label>
      </div>
    </div>
  );
}
