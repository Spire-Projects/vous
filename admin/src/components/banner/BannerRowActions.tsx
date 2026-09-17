import { Eye, EyeOff, Maximize2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/domain/entities/banner.entity";

interface BannerRowActionsProps {
  banner: Banner;
  onPreview: (banner: Banner) => void;
  onToggleActive: (id: string, current: boolean) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export function BannerRowActions({
  banner,
  onPreview,
  onToggleActive,
  onEdit,
  onDelete,
}: BannerRowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onPreview(banner)}
        title="Vista previa"
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
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onEdit(banner)}
        title="Editar"
      >
        <Pencil size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(banner.id)}
        className="text-red-600 hover:text-red-700"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
