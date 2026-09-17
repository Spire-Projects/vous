import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { BannerCard } from "@/components/banner/BannerCard";
import type { Banner } from "@/domain/entities/banner.entity";

interface BannerMobileListProps {
  banners: Banner[];
  loading: boolean;
  onPreview: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onNew: () => void;
}

export function BannerMobileList({
  banners,
  loading,
  onPreview,
  onEdit,
  onDelete,
  onToggleActive,
  onNew,
}: BannerMobileListProps) {
  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground font-nav text-xs uppercase tracking-wider bg-white rounded-2xl border border-border">
        Cargando banners...
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <EmptyState
        title="No hay banners configurados"
        description="Crea tu primer banner promocional para el carrusel de la tienda."
        action={
          <Button onClick={onNew}>
            <Plus size={14} /> Crear primer banner
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {banners.map((b, idx) => (
        <BannerCard
          key={b.id}
          banner={b}
          index={idx}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}
