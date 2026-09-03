import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryFormDialog } from "@/components/category/CategoryFormDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatCard } from "@/components/ui/StatCard";
import { GripVertical, Pencil, Trash2, Plus, Maximize2, Eye, EyeOff, X, ImageOff, LayoutGrid } from "lucide-react";
import type { Category, CreateCategoryInput } from "@/domain/entities/category.entity";

export function CategoriesPage() {
  const { categories, loading, create, update, remove, reorder } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [preview, setPreview] = useState<Category | null>(null);

  const activeCount = categories.filter((c) => c.isActive).length;

  function openCreate() { setEditing(null); setDialogOpen(true); }
  function openEdit(cat: Category) { setEditing(cat); setDialogOpen(true); }

  async function handleSave(data: CreateCategoryInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"? Esta acción no se puede deshacer.`)) return;
    await remove(cat.id);
  }

  async function handleToggleActive(cat: Category) {
    await update(cat.id, { ...cat, isActive: !cat.isActive });
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...categories];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    reorder(reordered.map((c, i) => ({ id: c.id, sortOrder: i })));
    setDragIdx(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Categorías"
        subtitle="Organiza la taxonomía del catálogo VOUS."
        action={
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={14} /> Nueva categoría
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Total Categorías" value={String(categories.length)} />
        <StatCard label="Activas" value={String(activeCount)} />
        <StatCard label="Inactivas" value={String(categories.length - activeCount)} />
      </div>

      {loading ? (
        <p className="text-sm text-vous-text-secondary font-nav uppercase tracking-wider">Cargando...</p>
      ) : (
        <>
          <div className="block md:hidden divide-y divide-white/30 border border-vous-border">
            {categories.length === 0 && (
              <p className="p-12 text-center text-vous-text-secondary font-nav text-sm uppercase tracking-wider">
                Sin categorías. Crea la primera.
              </p>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 space-y-3 bg-vous-surface">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 shrink-0 border border-vous-border overflow-hidden bg-vous-surface flex items-center justify-center">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      : <LayoutGrid size={16} className="text-vous-text-secondary" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Nombre</span>
                    <p className="font-nav text-[13px] font-semibold text-vous-text">{cat.name}</p>
                    <p className="text-[11px] text-vous-text-secondary truncate">{cat.slug}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Descripción</span>
                  <p className="text-[12px] text-vous-text-secondary font-sans">{cat.description || "—"}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Estado</span>
                    <div className="mt-0.5">
                      <Badge variant={cat.isActive ? "active" : "inactive"}>
                        {cat.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Orden</span>
                    <p className="font-nav text-[13px] text-vous-text-secondary">{cat.sortOrder + 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-1 border-t border-white/30">
                  <Button variant="ghost" size="icon-sm" onClick={() => setPreview(cat)} title="Ver detalle">
                    <Maximize2 size={13} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleToggleActive(cat)} title={cat.isActive ? "Desactivar" : "Activar"}>
                    {cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(cat)} className="text-red-600 hover:text-red-700"><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block border border-vous-border divide-y divide-white/30 overflow-x-auto">
            <div className="grid grid-cols-[40px_56px_1fr_1fr_80px_100px_106px] gap-4 px-4 py-2 bg-white/90">
              <span />
              <span />
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Nombre</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Descripción</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Orden</span>
              <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Estado</span>
              <span />
            </div>

            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={`grid grid-cols-[40px_56px_1fr_1fr_80px_100px_106px] gap-4 items-center px-4 py-3 bg-vous-surface hover:bg-amber-50/50 transition-colors ${dragIdx === idx ? "opacity-40" : ""}`}
              >
                <GripVertical size={16} className="text-vous-text-secondary cursor-grab shrink-0" />

                <button
                  onClick={() => setPreview(cat)}
                  className="w-12 h-12 border border-vous-border overflow-hidden hover:opacity-80 transition-opacity shrink-0 bg-vous-surface flex items-center justify-center"
                >
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    : <LayoutGrid size={16} className="text-vous-text-secondary" />
                  }
                </button>

                <div className="min-w-0">
                  <p className="font-nav text-[13px] font-semibold text-vous-text truncate">{cat.name}</p>
                  <p className="text-[11px] text-vous-text-secondary truncate">{cat.slug}</p>
                </div>

                <p className="text-[12px] text-vous-text-secondary font-sans line-clamp-2">{cat.description || "—"}</p>

                <span className="font-nav text-[13px] text-vous-text-secondary text-center">{cat.sortOrder + 1}</span>

                <div className="flex">
                  <Badge variant={cat.isActive ? "active" : "inactive"}>
                    {cat.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 shrink-0 flex-wrap">
                  <Button variant="ghost" size="icon-sm" onClick={() => setPreview(cat)} title="Ver detalle">
                    <Maximize2 size={13} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleToggleActive(cat)} title={cat.isActive ? "Desactivar" : "Activar"}>
                    {cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(cat)} className="text-red-600 hover:text-red-700"><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="p-12 text-center text-vous-text-secondary font-nav text-sm uppercase tracking-wider">
                Sin categorías. Crea la primera.
              </p>
            )}
          </div>
        </>
      )}

      <CategoryFormDialog
        open={dialogOpen}
        category={editing}
        nextOrder={categories.length}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <Dialog open={!!preview} onOpenChange={(o) => { if (!o) setPreview(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="font-nav text-[16px] tracking-widest uppercase text-vous-text">{preview.name}</DialogTitle>
                <p className="text-[11px] text-vous-text-secondary font-sans">{preview.slug}</p>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1.5">Imagen portada</p>
                  <div className="aspect-square border border-vous-border overflow-hidden bg-vous-surface flex items-center justify-center">
                    {preview.image
                      ? <img src={preview.image} alt={preview.name} className="w-full h-full object-cover" />
                      : <ImageOff size={24} className="text-vous-text-secondary" />
                    }
                  </div>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1.5">Banner</p>
                  <div className="aspect-square border border-vous-border overflow-hidden bg-vous-surface flex items-center justify-center">
                    {preview.banner
                      ? <img src={preview.banner} alt={`${preview.name} banner`} className="w-full h-full object-cover" />
                      : <ImageOff size={24} className="text-vous-text-secondary" />
                    }
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] font-sans">
                {preview.description && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Descripción</p>
                    <p className="text-vous-text-secondary leading-relaxed">{preview.description}</p>
                  </div>
                )}
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Estado</p>
                  <Badge variant={preview.isActive ? "active" : "inactive"}>
                    {preview.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Posición</p>
                  <p className="font-nav text-[15px] font-semibold text-vous-text">#{preview.sortOrder + 1}</p>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Creada</p>
                  <p className="text-vous-text-secondary">{new Date(preview.createdAt).toLocaleDateString("es-BO", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Actualizada</p>
                  <p className="text-vous-text-secondary">{new Date(preview.updatedAt).toLocaleDateString("es-BO", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/40">
                <Button variant="outline" onClick={() => setPreview(null)}>
                  <X size={13} /> Cerrar
                </Button>
                <Button onClick={() => { openEdit(preview); setPreview(null); }}>
                  <Pencil size={13} /> Editar categoría
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
