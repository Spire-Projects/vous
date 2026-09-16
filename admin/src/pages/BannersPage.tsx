import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/StatCard";
import { BannerFormDialog } from "@/components/banner/BannerFormDialog";
import { BannerRowItem } from "@/components/banner/BannerRowItem";
import { BannerPreviewDialog } from "@/components/banner/BannerPreviewDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useBanners } from "@/hooks/useBanners";
import type { Banner, CreateBannerInput } from "@/domain/entities/banner.entity";

export function BannersPage() {
  const { banners, loading, create, update, remove, toggleActive, reorder } = useBanners();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const activeCount = banners.filter((b) => b.active).length;

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(banner: Banner) { setEditing(banner); setDialogOpen(true); }

  async function handleSave(data: CreateBannerInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...banners];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    reorder(reordered);
    setDragIdx(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Banners"
        subtitle="Gestión y ordenamiento de banners para la landing page de VOUS."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Nuevo banner</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Banners" value={String(banners.length)} />
        <StatCard label="Activos" value={String(activeCount)} />
        <StatCard label="Inactivos" value={String(banners.length - activeCount)} />
      </div>

      <div className="bg-white border border-vous-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-gray font-nav text-[11px] uppercase tracking-wider">
            Cargando banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-vous-gray font-sans text-sm">
            No hay banners configurados. Crea el primero.
          </div>
        ) : (
          <div className="divide-y divide-vous-border">
            {banners.map((banner, idx) => (
              <BannerRowItem
                key={banner.id}
                banner={banner}
                index={idx}
                isDragging={dragIdx === idx}
                onDragStart={() => setDragIdx(idx)}
                onDrop={() => handleDrop(idx)}
                onPreview={(b) => setPreviewBanner(b)}
                onEdit={handleEdit}
                onDelete={(id) => setConfirmDelete(id)}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        )}
      </div>

      <BannerFormDialog
        open={dialogOpen}
        banner={editing}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <BannerPreviewDialog
        open={!!previewBanner}
        banner={previewBanner}
        onClose={() => setPreviewBanner(null)}
        onEdit={handleEdit}
      />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar banner?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}
