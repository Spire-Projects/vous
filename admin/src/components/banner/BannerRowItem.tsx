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
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`flex items-center gap-3 p-4 hover:bg-vous-cream/40 transition-colors ${
        isDragging ? "opacity-30 bg-vous-cream border-2 border-dashed border-vous-gold" : ""
      }`}
    >
      <div className="flex items-center gap-1 shrink-0">
        <GripVertical size={16} className="text-vous-gray cursor-grab active:cursor-grabbing shrink-0" />
        <span className="font-nav text-[11px] text-vous-gray w-5 text-center">#{index + 1}</span>
      </div>

      <div
        onClick={() => onPreview(banner)}
        className="shrink-0 w-24 h-16 overflow-hidden border border-vous-border bg-vous-cream cursor-pointer group relative"
        title="Clic para previsualizar"
      >
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-vous-gray text-[10px] font-nav">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Maximize2 size={14} className="text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-nav text-[13px] font-semibold text-vous-black truncate">{banner.title}</p>
          <Badge variant={banner.active ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
            {banner.active ? "Activo" : "Inactivo"}
          </Badge>
          <Badge
            variant={isCtaVisible ? "default" : "outline"}
            className={`font-nav text-[9px] uppercase tracking-wider ${
              isCtaVisible ? "bg-vous-gold/20 text-vous-gold-muted border-vous-gold/30" : "text-vous-gray"
            }`}
          >
            {isCtaVisible ? "CTA visible" : "CTA oculto"}
          </Badge>
        </div>
        <p className="text-[12px] text-vous-gray font-sans line-clamp-1">{banner.subtitle || "—"}</p>
        <p className="text-[10px] text-vous-gray-light font-nav mt-1">
          CTA: {banner.ctaText || "(Sin texto)"} → {banner.ctaUrl || "/"}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onPreview(banner)}
          title="Vista previa del banner"
        >
          <Maximize2 size={13} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onToggleActive(banner.id, banner.active)}
          title={banner.active ? "Desactivar" : "Activar"}
        >
          {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(banner)} title="Editar banner">
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(banner.id)}
          className="hover:text-red-500"
          title="Eliminar banner"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
