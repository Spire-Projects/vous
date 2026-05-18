import { useState } from "react";
import { Search, Plus, Star, Eye, EyeOff, Pencil, Trash2, Maximize2, X, FileText, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlogPostFormDialog } from "@/components/blog/BlogPostFormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import type { BlogPost, CreateBlogPostInput } from "@/domain/entities/blog-post.entity";

export function BlogPage() {
  const { posts, loading, create, update, remove, toggleStatus, toggleFeatured } = useBlogPosts();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [preview, setPreview] = useState<BlogPost | null>(null);

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
                {["Img", "Artículo", "Categoría", "Autor", "Estado", "⭐", "Publicado", ""].map((h) => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-vous-gray py-10">No hay artículos. Crea el primero.</TableCell></TableRow>
              ) : filtered.map((post) => (
                <TableRow key={post.id}>
                  {/* Cover thumbnail */}
                  <TableCell className="w-14">
                    <button
                      onClick={() => setPreview(post)}
                      className="w-11 h-14 rounded border border-vous-border overflow-hidden hover:opacity-80 transition-opacity bg-vous-bg flex items-center justify-center"
                    >
                      {post.coverImage
                        ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        : <FileText size={16} className="text-vous-gray" />
                      }
                    </button>
                  </TableCell>

                  {/* Título */}
                  <TableCell>
                    <p className="font-nav text-[13px] font-semibold text-vous-black line-clamp-1 max-w-[220px]">{post.title}</p>
                    <p className="text-[11px] text-vous-gray font-sans">{post.slug}</p>
                    {post.excerpt && (
                      <p className="text-[11px] text-vous-gray font-sans line-clamp-1 mt-0.5 max-w-[220px] italic">{post.excerpt}</p>
                    )}
                  </TableCell>

                  {/* Categoría */}
                  <TableCell>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-nav uppercase tracking-wider border border-vous-border rounded text-vous-gray">
                      {post.category || "—"}
                    </span>
                  </TableCell>

                  {/* Autor */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">{post.authorName || "—"}</TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Badge variant={post.status === "published" ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
                      {post.status === "published" ? "Publicado" : "Borrador"}
                    </Badge>
                  </TableCell>

                  {/* Destacado */}
                  <TableCell>
                    <Button variant="ghost" size="icon-sm" onClick={() => toggleFeatured(post.id, post.featured)} title={post.featured ? "Quitar destacado" : "Fijar como destacado"}>
                      <Star size={15} className={post.featured ? "fill-amber-400 text-amber-400" : "text-vous-gray-light"} />
                    </Button>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="text-[12px] font-sans text-vous-gray whitespace-nowrap">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => setPreview(post)} title="Ver detalle">
                        <Maximize2 size={13} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleStatus(post.id, post.status)} title={post.status === "published" ? "Despublicar" : "Publicar"}>
                        {post.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(post)}><Pencil size={14} /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(post.id)} className="hover:text-red-500"><Trash2 size={14} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <BlogPostFormDialog open={dialogOpen} post={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar artículo?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />

      {/* Article Detail Modal */}
      <Dialog open={!!preview} onOpenChange={(o) => { if (!o) setPreview(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="font-nav text-[15px] tracking-widest uppercase leading-snug">{preview.title}</DialogTitle>
                <p className="text-[11px] text-vous-gray font-sans">{preview.slug}</p>
              </DialogHeader>

              {/* Cover */}
              {preview.coverImage && (
                <div className="w-full aspect-video rounded overflow-hidden bg-vous-bg">
                  <img src={preview.coverImage} alt={preview.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-[12px] font-sans">
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Categoría</p>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-nav uppercase tracking-wider border border-vous-border rounded text-vous-gray">
                    {preview.category || "—"}
                  </span>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Estado</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={preview.status === "published" ? "active" : "inactive"} className="text-[10px] uppercase tracking-wide">
                      {preview.status === "published" ? "Publicado" : "Borrador"}
                    </Badge>
                    {preview.featured && (
                      <span className="flex items-center gap-0.5 text-[10px] font-nav text-amber-500 uppercase">
                        <Star size={10} fill="currentColor" />Destacado
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Autor</p>
                  <p className="text-vous-gray">{preview.authorName || "—"}</p>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Publicado</p>
                  <p className="text-vous-gray">
                    {preview.publishedAt
                      ? new Date(preview.publishedAt).toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })
                      : "No publicado aún"}
                  </p>
                </div>
                {preview.excerpt && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Extracto</p>
                    <p className="text-vous-gray leading-relaxed italic">{preview.excerpt}</p>
                  </div>
                )}
                {/* Content preview */}
                <div className="col-span-2">
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-2">Contenido (preview)</p>
                  <div
                    className="prose prose-sm max-w-none text-vous-gray border border-vous-border rounded p-3 max-h-48 overflow-y-auto bg-vous-bg text-[12px] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: preview.content }}
                  />
                </div>
                {preview.tags.length > 0 && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] bg-vous-bg border border-vous-border rounded font-sans">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(preview.seoTitle || preview.seoDescription) && (
                  <div className="col-span-2 border border-vous-border rounded p-3 bg-vous-bg space-y-1">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">SEO</p>
                    {preview.seoTitle && <p className="text-[12px] font-semibold text-vous-black">{preview.seoTitle}</p>}
                    {preview.seoDescription && <p className="text-[11px] text-vous-gray">{preview.seoDescription}</p>}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-vous-border">
                {preview.status === "published" && (
                  <a
                    href={`http://localhost:3000/revista/${preview.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink size={13} /> Ver en landing
                    </Button>
                  </a>
                )}
                <Button variant="outline" onClick={() => setPreview(null)}>
                  <X size={13} /> Cerrar
                </Button>
                <Button onClick={() => { handleEdit(preview); setPreview(null); }}>
                  <Pencil size={13} /> Editar artículo
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
