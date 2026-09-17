import { GripVertical, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BannerRowActions } from "./BannerRowActions";
import type { Banner } from "@/domain/entities/banner.entity";

interface BannerCardProps {
  banner: Banner;
  index: number;
  onPreview: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
}

export function BannerCard({
  banner,
  index,
  onPreview,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerCardProps) {
  const isCtaVisible = banner.ctaVisible !== false;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            onClick={() => onPreview(banner)}
            className="w-16 h-12 shrink-0 rounded-lg border border-border overflow-hidden bg-muted cursor-pointer relative group"
            title="Ver imagen"
          >
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[9px] font-nav">
                Sin foto
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 size={12} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-nav text-[13px] font-semibold text-foreground truncate">
                {banner.title}
              </p>
              {index === 0 && (
                <span className="text-[9px] font-nav uppercase tracking-wider text-vous-gold-dark font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                  Hero
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {banner.subtitle || "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge
            variant={banner.active ? "active" : "inactive"}
            className="text-[9px] uppercase"
          >
            {banner.active ? "Activo" : "Inactivo"}
          </Badge>
          <span className="text-[10px] font-nav text-muted-foreground">
            #{index + 1}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs border-t border-border/50 pt-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase font-nav text-muted-foreground">
            Redirección
          </p>
          <p className="text-[11px] font-mono text-foreground truncate">
            {banner.ctaText || "Ver Todo"} →{" "}
            {banner.categorySlug
              ? `cat: ${banner.categorySlug}`
              : banner.ctaUrl}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`text-[9px] shrink-0 ${isCtaVisible ? "text-vous-gold-dark border-vous-gold/50" : "text-muted-foreground"}`}
        >
          {isCtaVisible ? "CTA visible" : "CTA oculto"}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-[10px] font-nav text-muted-foreground flex items-center gap-1">
          <GripVertical size={12} className="text-muted-foreground" />
          Orden de carrusel
        </span>
        <BannerRowActions
          banner={banner}
          onPreview={onPreview}
          onToggleActive={onToggleActive}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
