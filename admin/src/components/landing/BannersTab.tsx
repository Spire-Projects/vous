import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { BannerFormDialog } from "@/components/banner/BannerFormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useBanners } from "@/hooks/useBanners";
import type { Banner, CreateBannerInput } from "@/domain/entities/banner.entity";

export function BannersTab() {
  const { banners, loading, create, update, remove, toggleActive, reorder } = useBanners();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
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
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
          <StatCard label="Total" value={String(banners.length)} />
          <StatCard label="Activos" value={String(activeCount)} />
          <StatCard label="Inactivos" value={String(banners.length - activeCount)} />
        </div>
        <Button onClick={handleNew} className="ml-4 shrink-0">
          <Plus size={14} strokeWidth={2} />Nuevo banner
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">
            Cargando banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-vous-text-secondary font-sans text-sm">
            No hay banners. Crea el primero.
          </div>
        ) : (
          <div className="divide-y divide-white/30 overflow-x-auto">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={`flex items-start gap-3 p-4 hover:bg-amber-50/30 transition-colors ${dragIdx === idx ? "opacity-40" : ""}`}
              >
                <GripVertical size={16} className="text-vous-text-muted mt-0.5 shrink-0 cursor-grab" />
                <div className="shrink-0 w-24 h-16 overflow-hidden border border-vous-border">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/90 flex items-center justify-center text-vous-text-secondary text-[10px]">Sin imagen</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Título</span>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-nav text-[13px] font-semibold text-vous-text">{banner.title}</p>
                    <Badge variant={banner.active ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
                      {banner.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Subtítulo</span>
                  <p className="text-[12px] text-vous-text-secondary font-sans line-clamp-1">{banner.subtitle}</p>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Orden</span>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden mt-1">CTA</span>
                  <p className="text-[10px] text-vous-text-muted font-nav mt-1">
                    Orden: {banner.order} · CTA: {banner.ctaText} → {banner.ctaUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(banner.id, banner.active)} title={banner.active ? "Desactivar" : "Activar"}>
                    {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(banner)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(banner.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BannerFormDialog open={dialogOpen} banner={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar banner?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </>
  );
}
