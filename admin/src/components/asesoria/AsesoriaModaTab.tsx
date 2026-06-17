import { useState, useEffect } from "react";
import { Save, Loader2, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import type { ContentSection } from "@/domain/entities/site-config.entity";

export function AsesoriaModaTab() {
  const { config, loading, saving, update } = useSiteConfig();

  const [form, setForm] = useState<ContentSection>({
    isActive: true,
    title: "",
    subtitle: "",
    content: "",
    imageUrl: "",
    linkUrl: "",
  });

  useEffect(() => {
    if (config?.fashionTrends) {
      setForm(config.fashionTrends);
    }
  }, [config]);

  async function handleSave() {
    await update({ fashionTrends: form });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-vous-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2} />}
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-white/60 border border-vous-border rounded-2xl px-5 py-4">
            <Checkbox
              id="asesoria-active"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v === true }))}
            />
            <Label htmlFor="asesoria-active" className="text-sm font-sans cursor-pointer">
              Mostrar sección "Asesoría de Moda" en la landing
            </Label>
            {form.isActive ? <Eye size={14} className="ml-auto text-emerald-600" /> : <EyeOff size={14} className="ml-auto text-vous-text-muted" />}
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-5 sm:p-8 space-y-6">
            <div className="space-y-1">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Asesoría de Moda VOUS"
              />
            </div>

            <div className="space-y-1">
              <Label>Subtítulo</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Ej: Encuentra el estilo perfecto para vos"
              />
            </div>

            <div className="space-y-1">
              <Label>Contenido</Label>
              <RichTextEditor
                content={form.content}
                onChange={(v) => setForm((f) => ({ ...f, content: v }))}
              />
            </div>

            <div className="space-y-1">
              <Label>Imagen principal</Label>
              <ImagePicker
                value={form.imageUrl ?? ""}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                folder="vous/asesoria"
                label="Subir imagen"
                aspect="video"
              />
            </div>

            <div className="space-y-1">
              <Label>Link externo (opcional)</Label>
              <Input
                value={form.linkUrl ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-vous-text flex items-center gap-2">
            <Lightbulb size={16} className="text-vous-gold" />
            Vista previa en landing
          </h3>
          <div className="bg-white border border-vous-border rounded-2xl overflow-hidden shadow-sm relative">
            {/* Fake header */}
            <div className="bg-black py-10 px-6">
              <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-white/40 block mb-2">
                {form.subtitle || "Subtítulo"}
              </span>
              <h1 className="font-serif text-2xl text-white leading-tight">
                {form.title || "Título de la sección"}
              </h1>
            </div>
            {/* Fake content */}
            <div className="p-6">
              {form.imageUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-neutral-100">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div
                className="prose prose-sm max-w-none text-black/60 font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: form.content || "<p>El contenido aparecerá aquí...</p>" }}
              />
              {form.linkUrl && (
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 bg-black text-white font-nav text-[10px] uppercase tracking-wider rounded-lg">
                    Ver más
                  </span>
                </div>
              )}
            </div>
            {!form.isActive && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <span className="font-nav text-[11px] uppercase tracking-wider text-vous-text-secondary">Sección inactiva</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
            <p className="text-[11px] font-nav uppercase tracking-wider text-amber-700 mb-1">Nota</p>
            <p className="text-sm text-vous-text-secondary font-sans">
              La página de Asesoría de Moda en el landing también muestra automáticamente las guías de estilo configuradas en "Guías de Estilo" (tonos de piel y tipos de cuerpo).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
