import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BannerPreview } from "./BannerPreview";
import type { Banner } from "@/domain/entities/banner.entity";

interface BannerPreviewDialogProps {
  banner: Banner | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (banner: Banner) => void;
}

export function BannerPreviewDialog({
  banner,
  open,
  onClose,
  onEdit,
}: BannerPreviewDialogProps) {
  if (!banner) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[14px] uppercase tracking-wider">
            Vista previa del Banner
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <BannerPreview
            title={banner.title}
            subtitle={banner.subtitle}
            imageUrl={banner.imageUrl}
            ctaText={banner.ctaText}
            ctaVisible={banner.ctaVisible !== false}
          />
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-vous-border">
          <span className="text-[11px] text-vous-text-secondary font-nav">
            Orden: #{banner.order + 1} · {banner.active ? "Activo" : "Inactivo"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  onClose();
                  onEdit(banner);
                }}
              >
                Editar banner
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
