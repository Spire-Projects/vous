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

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">
            Cargando banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-vous-text-secondary font-sans text-sm">
            No hay banners configurados. Crea el primero.
          </div>
        ) : (
          <div className="divide-y divide-white/30 overflow-x-auto">
            <div className="hidden md:grid grid-cols-[36px_72px_1.5fr_1fr_60px_140px_120px] gap-4 px-4 py-2.5 bg-white/90 border-b border-white/40">
              <span />
              <span />
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Título</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Subtítulo / CTA</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary text-center">Orden</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Estado</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary text-right">Acciones</span>
            </div>
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

      <BannerFormDialog open={dialogOpen} banner={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />
      <BannerPreviewDialog open={!!previewBanner} banner={previewBanner} onClose={() => setPreviewBanner(null)} onEdit={handleEdit} />
      <ConfirmDeleteDialog open={!!confirmDelete} title="¿Eliminar banner?" onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} />
    </div>
  );
}
