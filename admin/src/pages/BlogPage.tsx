import { useState } from "react";
import { Search, Plus, Star, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { BlogPostFormDialog } from "@/components/blog/BlogPostFormDialog";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import type { BlogPost, CreateBlogPostInput } from "@/domain/entities/blog-post.entity";

export function BlogPage() {
  const { posts, loading, create, update, remove, toggleStatus, toggleFeatured } = useBlogPosts();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = posts.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );
  const published = posts.filter((p) => p.status === "published").length;
  const featured = posts.filter((p) => p.featured).length;

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(post: BlogPost) { setEditing(post); setDialogOpen(true); }

  async function handleSave(data: CreateBlogPostInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Blog / Revista"
        subtitle="Gestión de publicaciones editoriales de la marca VOUS."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Nuevo artículo</Button>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total artículos" value={String(posts.length)} />
        <StatCard label="Publicados" value={String(published)} />
        <StatCard label="Borradores" value={String(posts.length - published)} />
        <StatCard label="Destacados" value={String(featured)} />
      </div>

      <div className="bg-vous-white border border-vous-border">
        <div className="p-4 border-b border-vous-border">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
            <Input placeholder="Buscar artículo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-vous-gray font-nav text-[11px] uppercase tracking-wider">Cargando artículos...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Artículo", "Categoría", "Estado", "Destacado", "Fecha", ""].map((h) => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-vous-gray py-10">No hay artículos. Crea el primero.</TableCell></TableRow>
              ) : filtered.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <p className="font-nav text-[13px] font-semibold text-vous-black line-clamp-1">{post.title}</p>
                    <p className="text-[11px] text-vous-gray font-sans">{post.slug}</p>
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">{post.category}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "outline"} className="font-nav text-[10px] uppercase tracking-wide">
                      {post.status === "published" ? "Publicado" : "Borrador"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleFeatured(post.id, post.featured)} title={post.featured ? "Quitar destacado" : "Fijar como destacado"}>
                      <Star size={15} className={post.featured ? "fill-vous-gold text-vous-gold" : "text-vous-gray-light"} />
                    </button>
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-BO") : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(post.id, post.status)} title={post.status === "published" ? "Despublicar" : "Publicar"} className="text-vous-gray hover:text-vous-black transition-colors">
                        {post.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => handleEdit(post)} className="text-vous-gray hover:text-vous-black transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setConfirmDelete(post.id)} className="text-vous-gray hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <BlogPostFormDialog open={dialogOpen} post={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      {confirmDelete && (
        <div className="fixed inset-0 bg-vous-black/50 z-50 flex items-center justify-center">
          <div className="bg-vous-white border border-vous-border p-6 max-w-sm w-full mx-4">
            <p className="font-nav text-[13px] uppercase tracking-wide text-vous-black mb-2">¿Eliminar artículo?</p>
            <p className="font-sans text-sm text-vous-gray mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
