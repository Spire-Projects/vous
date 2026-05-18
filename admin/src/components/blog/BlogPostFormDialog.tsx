import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "./RichTextEditor";
import { ImagePicker } from "@/components/shared/ImagePicker";
import type { BlogPost, CreateBlogPostInput, BlogPostStatus } from "@/domain/entities/blog-post.entity";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["Editorial", "Estilo", "Tendencias", "Proceso", "Behind the Scenes", "Campaña"];

interface BlogPostFormDialogProps {
  open: boolean;
  post: BlogPost | null;
  onClose: () => void;
  onSave: (data: CreateBlogPostInput) => Promise<void>;
}

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export function BlogPostFormDialog({ open, post, onClose, onSave }: BlogPostFormDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Editorial");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<BlogPostStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (post) {
      setTitle(post.title); setSlug(post.slug); setExcerpt(post.excerpt);
      setContent(post.content); setCoverImage(post.coverImage);
      setCategory(post.category); setTags(post.tags.join(", "));
      setStatus(post.status); setFeatured(post.featured);
    } else {
      setTitle(""); setSlug(""); setExcerpt(""); setContent("");
      setCoverImage(""); setCategory("Editorial"); setTags("");
      setStatus("draft"); setFeatured(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [post, open]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!post) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title, slug, excerpt, content, coverImage, category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status, featured,
        authorId: user?.uid ?? "admin",
        authorName: user?.name ?? user?.email ?? "Admin",
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {post ? "Editar Artículo" : "Nuevo Artículo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label>Título *</Label>
              <Input required value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="El título del artículo..." />
            </div>
            <div className="space-y-1">
              <Label>Slug *</Label>
              <Input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-del-articulo" />
            </div>
            <div className="space-y-1">
              <Label>Categoría *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Extracto</Label>
            <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Breve descripción del artículo..." />
          </div>
          <div className="space-y-1">
            <Label>Imagen de portada</Label>
            <ImagePicker value={coverImage} onChange={setCoverImage} folder="vous/blog" label="Subir imagen de portada" />
          </div>
          <div className="space-y-1">
            <Label>Contenido *</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Etiquetas (separadas por coma)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="moda, editorial, tendencias" />
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as BlogPostStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={featured} onCheckedChange={(v) => setFeatured(v === true)} />
            <Label className="mb-0">Fijar como artículo destacado</Label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando..." : post ? "Guardar cambios" : "Crear artículo"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
