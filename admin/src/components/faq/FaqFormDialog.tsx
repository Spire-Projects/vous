import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import type { FAQ, CreateFAQInput } from "@/domain/entities/faq.entity";

interface FaqFormDialogProps {
  open: boolean;
  faq: FAQ | null;
  onClose: () => void;
  onSave: (data: CreateFAQInput) => Promise<void>;
}

export function FaqFormDialog({ open, faq, onClose, onSave }: FaqFormDialogProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setOrder(faq.order);
      setIsActive(faq.isActive);
    } else {
      setQuestion("");
      setAnswer("");
      setOrder(0);
      setIsActive(true);
    }
  }, [faq, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ question, answer, order, isActive });
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
            {faq ? "Editar Pregunta" : "Nueva Pregunta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Pregunta *</Label>
            <Input
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Cómo puedo rastrear mi pedido?"
            />
          </div>
          <div className="space-y-1">
            <Label>Respuesta *</Label>
            <RichTextEditor content={answer} onChange={setAnswer} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Orden</Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-vous-gold w-4 h-4"
              />
              <span className="font-nav text-[12px] uppercase tracking-wide text-vous-black">
                Activa
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : faq ? "Guardar cambios" : "Crear pregunta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
