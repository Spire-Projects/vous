import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { BannerRowItem } from "@/components/banner/BannerRowItem";
import type { Banner } from "@/domain/entities/banner.entity";

interface BannerTableProps {
  banners: Banner[];
  loading: boolean;
  dragIdx: number | null;
  onDragStart: (idx: number) => void;
  onDrop: (idx: number) => void;
  onPreview: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onNew: () => void;
}

export function BannerTable({
  banners,
  loading,
  dragIdx,
  onDragStart,
  onDrop,
  onPreview,
  onEdit,
  onDelete,
  onToggleActive,
  onNew,
}: BannerTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-card shadow-sm bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-10 text-center">
              Mover
            </th>
            <th className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-16 text-center">
              Orden
            </th>
            <th className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-20">
              Foto
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Título y Enlace
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Subtítulo / CTA
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">
              Estado
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td
                colSpan={7}
                className="p-12 text-center text-muted-foreground font-nav text-xs uppercase tracking-wider"
              >
                Cargando banners...
              </td>
            </tr>
          ) : banners.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8">
                <EmptyState
                  title="No hay banners configurados"
                  description="Crea tu primer banner promocional para el carrusel de la tienda."
                  action={
                    <Button onClick={onNew}>
                      <Plus size={14} /> Crear primer banner
                    </Button>
                  }
                />
              </td>
            </tr>
          ) : (
            banners.map((b, idx) => (
              <BannerRowItem
                key={b.id}
                banner={b}
                index={idx}
                isDragging={dragIdx === idx}
                onDragStart={() => onDragStart(idx)}
                onDrop={() => onDrop(idx)}
                onPreview={onPreview}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
