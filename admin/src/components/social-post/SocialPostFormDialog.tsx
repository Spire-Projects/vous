import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { SocialPost, CreateSocialPostInput } from "@/domain/entities/social-post.entity";

interface SocialPostFormDialogProps {
  open: boolean;
  post: SocialPost | null;
  onClose: () => void;
  onSave: (data: CreateSocialPostInput) => Promise<void>;
}

export function SocialPostFormDialog({ open, post, onClose, onSave }: SocialPostFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState<SocialPost['platform']>("instagram");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setVideoUrl(post.videoUrl);
      setPlatform(post.platform);
      setThumbnailUrl(post.thumbnailUrl);
      setActive(post.active);
      setOrder(post.order);
    } else {
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setPlatform("instagram");
      setThumbnailUrl("");
      setActive(true);
      setOrder(0);
    }
  }, [post, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ title, description, videoUrl, platform, thumbnailUrl, active, order });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-wider">
            {post ? "Editar Post" : "Nuevo Post"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Nuevo look de verano" />
          </div>
          <div className="space-y-1">
            <Label>Descripción</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción..." />
          </div>
          <div className="space-y-1">
            <Label>URL del video *</Label>
            <Input required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>Plataforma</Label>
            <Select value={platform} onValueChange={(v: SocialPost["platform"]) => setPlatform(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>URL de miniatura</Label>
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>Orden</Label>
            <Input type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} id="sp-active" />
            <Label htmlFor="sp-active" className="mb-0">Activo</Label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : post ? "Guardar cambios" : "Crear post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
