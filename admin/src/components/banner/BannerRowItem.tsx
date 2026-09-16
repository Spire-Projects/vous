import { GripVertical, Pencil, Trash2, Eye, EyeOff, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "@/domain/entities/banner.entity";

interface BannerRowItemProps {
  banner: Banner;
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDrop: () => void;
  onPreview: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
}

export function BannerRowItem({
  banner,
  index,
  isDragging,
  onDragStart,
  onDrop,
  onPreview,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerRowItemProps) {
  const isCtaVisible = banner.ctaVisible !== false;

  return (
    <tr
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`border-b border-border/50 hover:bg-amber-50/30 transition-colors ${
        isDragging ? "opacity-40 bg-amber-50/50" : ""
      }`}
    >
      <td className="px-4 py-3 w-10 text-center">
        <GripVertical size={16} className="text-muted-foreground cursor-grab active:cursor-grabbing inline-block" />
      </td>

      <td className="px-3 py-3 w-16 text-center">
        <span className="font-nav text-[12px] font-semibold text-foreground">#{index + 1}</span>
        {index === 0 && (
          <span className="text-[8px] font-nav uppercase text-vous-gold-dark font-bold block">
            Hero
          </span>
        )}
      </td>

      <td className="px-3 py-3 w-20">
        <div
          onClick={() => onPreview(banner)}
          className="w-16 h-11 rounded border border-border overflow-hidden bg-muted cursor-pointer relative group"
        >
          {banner.imageUrl ? (
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[9px] font-nav">Sin foto</div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 size={12} className="text-white" />
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <p className="font-nav text-[13px] font-semibold text-foreground truncate max-w-xs">{banner.title}</p>
        <p className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
          {banner.categorySlug ? `cat: ${banner.categorySlug}` : banner.ctaUrl}
        </p>
      </td>

      <td className="px-4 py-3">
        <p className="text-[12px] text-muted-foreground font-sans line-clamp-1 max-w-sm">{banner.subtitle || "—"}</p>
        <p className="text-[10px] text-muted-foreground font-nav mt-0.5">CTA: {banner.ctaText || "Ver Todo"}</p>
      </td>

      <td className="px-4 py-3 text-center">
        <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
          <Badge variant={banner.active ? "active" : "inactive"} className="text-[9px] uppercase">
            {banner.active ? "Activo" : "Inactivo"}
          </Badge>
          <Badge variant="outline" className={`text-[9px] ${isCtaVisible ? "text-vous-gold-dark border-vous-gold/50" : "text-muted-foreground"}`}>
            {isCtaVisible ? "Visible" : "Oculto"}
          </Badge>
        </div>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onPreview(banner)} title="Vista previa"><Maximize2 size={13} /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onToggleActive(banner.id, banner.active)} title={banner.active ? "Desactivar" : "Activar"}>
            {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(banner)} title="Editar"><Pencil size={14} /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(banner.id)} className="text-red-600 hover:text-red-700" title="Eliminar"><Trash2 size={14} /></Button>
        </div>
      </td>
    </tr>
  );
}
