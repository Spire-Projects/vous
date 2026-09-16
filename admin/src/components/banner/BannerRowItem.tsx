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
      className={`transition-colors ${
        isDragging ? "opacity-40 bg-amber-50/50" : "bg-vous-surface hover:bg-amber-50/30"
      }`}
    >
      {/* ── Vista Mobile (< md) ── */}
      <div className="block md:hidden p-4 space-y-3">
        <div className="flex items-start gap-3">
          <GripVertical size={16} className="text-vous-text-secondary mt-1 cursor-grab shrink-0" />
          <div
            onClick={() => onPreview(banner)}
            className="w-16 h-12 shrink-0 border border-vous-border overflow-hidden bg-white cursor-pointer relative group"
          >
            {banner.imageUrl ? (
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-vous-text-secondary text-[9px] font-nav">
                Sin foto
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center">
              <Maximize2 size={12} className="text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Título</span>
            <p className="font-nav text-[13px] font-semibold text-vous-text truncate">{banner.title}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge variant={banner.active ? "active" : "inactive"} className="text-[9px] uppercase">
                {banner.active ? "Activo" : "Inactivo"}
              </Badge>
              <Badge variant="outline" className={`text-[9px] ${isCtaVisible ? "text-vous-gold-dark border-vous-gold/50" : "text-vous-text-muted"}`}>
                {isCtaVisible ? "CTA visible" : "CTA oculto"}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Subtítulo / CTA</span>
          <p className="text-[11px] text-vous-text-secondary font-sans line-clamp-1">{banner.subtitle || "—"}</p>
          <p className="text-[10px] text-vous-text-muted font-mono mt-0.5">
            CTA: {banner.ctaText || "Ver Todo"} → {banner.ctaUrl}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/40">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-nav text-vous-text-secondary">Posición #{index + 1}</span>
            {index === 0 && <span className="text-[9px] font-nav uppercase tracking-wider text-vous-gold-dark font-bold">Hero</span>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onPreview(banner)} title="Vista previa"><Maximize2 size={13} /></Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onToggleActive(banner.id, banner.active)} title={banner.active ? "Desactivar" : "Activar"}>
              {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(banner)} title="Editar"><Pencil size={14} /></Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(banner.id)} className="text-red-600 hover:text-red-700" title="Eliminar"><Trash2 size={14} /></Button>
          </div>
        </div>
      </div>

      {/* ── Vista Desktop (>= md) ── */}
      <div className="hidden md:grid grid-cols-[36px_72px_1.5fr_1fr_60px_140px_120px] gap-4 items-center px-4 py-3">
        <GripVertical size={16} className="text-vous-text-secondary cursor-grab shrink-0" />
        <div
          onClick={() => onPreview(banner)}
          className="w-16 h-11 border border-vous-border overflow-hidden bg-white cursor-pointer relative group"
        >
          {banner.imageUrl ? (
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-vous-text-secondary text-[9px] font-nav">Sin foto</div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <Maximize2 size={12} className="text-white" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="font-nav text-[13px] font-semibold text-vous-text truncate">{banner.title}</p>
          <p className="text-[10px] text-vous-text-muted font-mono truncate">{banner.categorySlug ? `cat: ${banner.categorySlug}` : banner.ctaUrl}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-vous-text-secondary font-sans truncate">{banner.subtitle || "—"}</p>
          <p className="text-[10px] text-vous-text-muted font-nav truncate">CTA: {banner.ctaText || "Ver Todo"}</p>
        </div>

        <div className="text-center">
          <span className="font-nav text-[13px] text-vous-text-secondary block">#{index + 1}</span>
          {index === 0 && <span className="text-[8px] font-nav uppercase text-vous-gold-dark font-bold block">Hero</span>}
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant={banner.active ? "active" : "inactive"} className="text-[9px] uppercase">
            {banner.active ? "Activo" : "Inactivo"}
          </Badge>
          <Badge variant="outline" className={`text-[9px] ${isCtaVisible ? "text-vous-gold-dark border-vous-gold/50" : "text-vous-text-muted"}`}>
            {isCtaVisible ? "Visible" : "Oculto"}
          </Badge>
        </div>

        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onPreview(banner)} title="Vista previa"><Maximize2 size={13} /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onToggleActive(banner.id, banner.active)} title={banner.active ? "Desactivar" : "Activar"}>{banner.active ? <EyeOff size={14} /> : <Eye size={14} />}</Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(banner)} title="Editar"><Pencil size={14} /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(banner.id)} className="text-red-600 hover:text-red-700" title="Eliminar"><Trash2 size={14} /></Button>
        </div>
      </div>
    </div>
  );
}
