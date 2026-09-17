import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Video } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { SocialPostFormDialog } from "@/components/social-post/SocialPostFormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useSocialPosts } from "@/hooks/useSocialPosts";
import type { SocialPost, CreateSocialPostInput } from "@/domain/entities/social-post.entity";

const PLATFORM_LABELS: Record<SocialPost["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
};



export function SocialPostsPage() {
  const { posts, loading, create, update, remove, toggleActive, reorder } = useSocialPosts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const activeCount = posts.filter((p) => p.active).length;

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(post: SocialPost) { setEditing(post); setDialogOpen(true); }

  async function handleSave(data: CreateSocialPostInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...posts];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    reorder(reordered);
    setDragIdx(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="New Post"
        subtitle="Se podrá ver los nuevos videos subidos en nuestras redes. Gestiona los posts y videos que aparecen en la landing."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Nuevo post</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(posts.length)} />
        <StatCard label="Activos" value={String(activeCount)} />
        <StatCard label="Inactivos" value={String(posts.length - activeCount)} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">
            Cargando posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-vous-text-secondary font-sans text-sm">
            No hay posts. Crea el primero.
          </div>
        ) : (
          <div className="divide-y divide-white/30 overflow-x-auto">
            {posts.map((post, idx) => (
              <div
                key={post.id}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={`flex items-start gap-3 p-4 hover:bg-amber-50/30 transition-colors ${dragIdx === idx ? "opacity-40" : ""}`}
              >
                <GripVertical size={16} className="text-vous-text-muted mt-0.5 shrink-0 cursor-grab" />
                <div className="shrink-0 w-24 h-16 overflow-hidden border border-vous-border">
                  {post.thumbnailUrl ? (
                    <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/90 flex items-center justify-center text-vous-text-secondary text-[10px]"><Video size={16} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Título</span>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-nav text-[13px] font-semibold text-vous-text">{post.title}</p>
                    <Badge variant={post.active ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
                      {post.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Descripción</span>
                  <p className="text-[12px] text-vous-text-secondary font-sans line-clamp-1">{post.description}</p>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Orden</span>
                  <p className="text-[10px] text-vous-text-muted font-nav mt-1">
                    Orden: {post.order} · Plataforma: {PLATFORM_LABELS[post.platform]} · URL: {post.videoUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(post.id, post.active)} title={post.active ? "Desactivar" : "Activar"}>
                    {post.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(post)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(post.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SocialPostFormDialog open={dialogOpen} post={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar post?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}
