import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/StatCard";
import { BannerFormDialog } from "@/components/banner/BannerFormDialog";
import { BannerRowItem } from "@/components/banner/BannerRowItem";
import { BannerCard } from "@/components/banner/BannerCard";
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

  const mobileContent = loading ? (
    <div className="p-8 text-center text-muted-foreground font-nav text-xs uppercase tracking-wider bg-white rounded-2xl border border-border">
      Cargando banners...
    </div>
  ) : banners.length === 0 ? (
    <div className="p-8 text-center space-y-3 bg-white rounded-2xl border border-border">
      <p className="text-muted-foreground text-sm font-sans">
        No hay banners configurados para la tienda. Crea el primero.
      </p>
      <Button onClick={handleNew}><Plus size={14} /> Crear primer banner</Button>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {banners.map((b, idx) => (
        <BannerCard
          key={b.id} banner={b} index={idx}
          onPreview={(item) => setPreviewBanner(item)}
          onEdit={handleEdit} onDelete={(id) => setConfirmDelete(id)}
          onToggleActive={toggleActive}
        />
      ))}
    </div>
  );

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground px-1">
        <p className="flex items-center gap-1.5 font-sans">
          <GripVertical size={14} className="text-muted-foreground shrink-0" />
          <span>Arrastra los banners verticalmente para reordenar la secuencia del carrusel.</span>
        </p>
        <span className="font-nav text-[11px] text-muted-foreground">Posición #1 = Portada principal</span>
      </div>

      <div className="md:hidden">{mobileContent}</div>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-card shadow-sm bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-10 text-center">Mover</th>
              <th className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-16 text-center">Orden</th>
              <th className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-20">Foto</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Título y Enlace</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subtítulo / CTA</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Estado</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={7} className="p-12 text-center text-muted-foreground font-nav text-xs uppercase tracking-wider">Cargando banners...</td></tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <p className="text-muted-foreground font-sans text-sm mb-3">No hay banners configurados para la tienda. Crea el primero.</p>
                  <Button onClick={handleNew}><Plus size={14} /> Crear primer banner</Button>
                </td>
              </tr>
            ) : (
              banners.map((b, idx) => (
                <BannerRowItem
                  key={b.id} banner={b} index={idx} isDragging={dragIdx === idx}
                  onDragStart={() => setDragIdx(idx)} onDrop={() => handleDrop(idx)}
                  onPreview={(item) => setPreviewBanner(item)} onEdit={handleEdit}
                  onDelete={(id) => setConfirmDelete(id)} onToggleActive={toggleActive}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <BannerFormDialog open={dialogOpen} banner={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />
      <BannerPreviewDialog open={!!previewBanner} banner={previewBanner} onClose={() => setPreviewBanner(null)} onEdit={handleEdit} />
      <ConfirmDeleteDialog open={!!confirmDelete} title="¿Eliminar banner?" onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} />
    </div>
  );
}
