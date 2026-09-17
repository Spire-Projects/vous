import { useState } from "react";
import { Save, FileText, Link2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { useWholesaleRules } from "@/hooks/useWholesaleRules";

export function WholesaleTermsPanel() {
  const { rules, loading, error, update } = useWholesaleRules();
  const [saving, setSaving] = useState(false);

  const [termsContent, setTermsContent] = useState("");
  const [termsUrl, setTermsUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Initialize from rules when loaded
  useState(() => {
    if (rules) {
      setTermsContent(rules.termsContent ?? "");
      setTermsUrl(rules.termsUrl ?? "");
    }
  });

  async function handleSave() {
    setSaving(true);
    try {
      await update({ termsContent, termsUrl: termsUrl.trim() || undefined });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="py-16 text-center"><p className="text-sm text-red-600 font-nav">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-vous-gold" />
        <h3 className="font-nav text-[13px] uppercase tracking-wider text-vous-text">Términos para Mayoristas</h3>
      </div>

      <p className="text-sm text-vous-text-secondary font-sans">
        Este es el documento de reglas de conducta y marca que los clientes deben leer y aceptar antes de enviar su solicitud como distribuidor mayorista.
        <span className="block mt-1 text-vous-text-muted text-xs">Diferente de la Configuración Comercial (montos, descuentos y restricciones operativas).</span>
      </p>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Link externo al documento (opcional)</Label>
          <div className="flex gap-2">
            <Link2 size={14} className="text-vous-text-secondary shrink-0 mt-2.5" />
            <Input
              value={termsUrl}
              onChange={(e) => setTermsUrl(e.target.value)}
              placeholder="https://drive.google.com/... o link a PDF de reglas"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Contenido de los términos</Label>
          <RichTextEditor
            content={termsContent}
            onChange={setTermsContent}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/40">
        <Button type="button" variant="outline" onClick={() => setShowPreview((v) => !v)}>
          <Eye size={14} /> {showPreview ? "Ocultar vista previa" : "Vista previa"}
        </Button>
        <Button onClick={() => void handleSave()} disabled={saving}>
          <Save size={14} /> {saving ? "Guardando..." : "Guardar Términos"}
        </Button>
      </div>

      {showPreview && (
        <div className="bg-white border border-vous-border rounded-2xl p-6">
          <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-3">Vista previa en landing</p>
          {termsUrl && (
            <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-vous-gold hover:underline mb-4">
              <Link2 size={12} /> Ver documento completo
            </a>
          )}
          <div
            className="prose prose-sm max-w-none text-vous-text-secondary font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: termsContent || "<p>Sin contenido configurado.</p>" }}
          />
        </div>
      )}
    </div>
  );
}
