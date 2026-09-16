import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BannerImageUploaders } from "./BannerImageUploaders";
import { BannerPreview } from "./BannerPreview";
import { BannerFormFields } from "./BannerFormFields";
import { useCategories } from "@/hooks/useCategories";
import { useBannerForm } from "@/hooks/useBannerForm";
import { Eye, Edit3 } from "lucide-react";
import type {
  Banner,
  CreateBannerInput,
} from "@/domain/entities/banner.entity";

interface BannerFormDialogProps {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: CreateBannerInput) => Promise<void>;
}

export function BannerFormDialog({
  open,
  banner,
  onClose,
  onSave,
}: BannerFormDialogProps) {
  const { categories } = useCategories();
  const form = useBannerForm({ banner, open, onSave, onClose });

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-vous-border">
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {banner ? "Editar Banner" : "Nuevo Banner"}
          </DialogTitle>
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded border border-vous-border">
            <button
              type="button"
              onClick={() => form.setTab("form")}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-nav rounded ${form.tab === "form" ? "bg-white text-vous-text shadow-xs font-medium" : "text-vous-text-secondary"}`}
            >
              <Edit3 size={12} /> Edición
            </button>
            <button
              type="button"
              onClick={() => form.setTab("preview")}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-nav rounded ${form.tab === "preview" ? "bg-white text-vous-text shadow-xs font-medium" : "text-vous-text-secondary"}`}
            >
              <Eye size={12} /> Vista Previa
            </button>
          </div>
        </DialogHeader>

        {form.tab === "preview" ? (
          <div className="py-4">
            <BannerPreview
              title={form.title}
              subtitle={form.subtitle}
              imageUrl={form.imageUrl}
              ctaText={form.ctaText}
              ctaVisible={form.ctaVisible}
            />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit} className="space-y-4 pt-2">
            <BannerImageUploaders
              imageUrl={form.imageUrl}
              tabletImageUrl={form.tabletImageUrl}
              mobileImageUrl={form.mobileImageUrl}
              onImageChange={form.setImageUrl}
              onTabletImageChange={form.setTabletImageUrl}
              onMobileImageChange={form.setMobileImageUrl}
            />
            <BannerFormFields
              title={form.title}
              subtitle={form.subtitle}
              ctaText={form.ctaText}
              ctaVisible={form.ctaVisible}
              categorySlug={form.categorySlug}
              active={form.active}
              categories={categories}
              onTitleChange={form.setTitle}
              onSubtitleChange={form.setSubtitle}
              onCtaTextChange={form.setCtaText}
              onCtaVisibleChange={form.setCtaVisible}
              onCategorySlugChange={form.setCategorySlug}
              onActiveChange={form.setActive}
            />
            <div className="flex justify-end gap-3 pt-3 border-t border-vous-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  form.saving || !form.imageUrl.trim() || !form.title.trim()
                }
              >
                {form.saving
                  ? "Guardando..."
                  : banner
                    ? "Guardar cambios"
                    : "Crear banner"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
