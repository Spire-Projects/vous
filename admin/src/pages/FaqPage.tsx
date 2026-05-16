import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaqFormDialog } from "@/components/faq/FaqFormDialog";
import { useFAQs } from "@/hooks/useFaqs";
import type { FAQ, CreateFAQInput } from "@/domain/entities/faq.entity";

export function FaqPage() {
  const { faqs, loading, create, update, remove, toggleActive } = useFAQs();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeCount = faqs.filter((f) => f.isActive).length;

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(faq: FAQ) { setEditing(faq); setDialogOpen(true); }

  async function handleSave(data: CreateFAQInput) {
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
        title="Preguntas Frecuentes"
        subtitle="Gestión de FAQs para la landing de VOUS."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Nueva pregunta</Button>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="border border-vous-border bg-vous-white p-4">
          <p className="text-[11px] font-nav uppercase tracking-wider text-vous-gray mb-1">Total</p>
          <p className="text-2xl font-serif text-vous-black">{faqs.length}</p>
        </div>
        <div className="border border-vous-border bg-vous-white p-4">
          <p className="text-[11px] font-nav uppercase tracking-wider text-vous-gray mb-1">Activas</p>
          <p className="text-2xl font-serif text-vous-black">{activeCount}</p>
        </div>
        <div className="border border-vous-border bg-vous-white p-4">
          <p className="text-[11px] font-nav uppercase tracking-wider text-vous-gray mb-1">Inactivas</p>
          <p className="text-2xl font-serif text-vous-black">{faqs.length - activeCount}</p>
        </div>
      </div>

      <div className="bg-vous-white border border-vous-border">
        {loading ? (
          <div className="p-12 text-center text-vous-gray font-nav text-[11px] uppercase tracking-wider">
            Cargando preguntas...
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-vous-gray font-sans text-sm">
            No hay preguntas. Crea la primera.
          </div>
        ) : (
          <div className="divide-y divide-vous-border">
            {faqs.map((faq) => (
              <div key={faq.id} className="flex items-start gap-3 p-4 hover:bg-vous-cream/30 transition-colors">
                <GripVertical size={16} className="text-vous-gray-light mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-nav text-[13px] font-semibold text-vous-black">{faq.question}</p>
                    <Badge variant={faq.isActive ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
                      {faq.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-vous-gray font-sans line-clamp-2">{faq.answer}</p>
                  <p className="text-[10px] text-vous-gray-light font-nav mt-1">Orden: {faq.order}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(faq.id, faq.isActive)}
                    title={faq.isActive ? "Desactivar" : "Activar"}
                    className="text-vous-gray hover:text-vous-black transition-colors"
                  >
                    {faq.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => handleEdit(faq)} className="text-vous-gray hover:text-vous-black transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmDelete(faq.id)} className="text-vous-gray hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FaqFormDialog open={dialogOpen} faq={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      {confirmDelete && (
        <div className="fixed inset-0 bg-vous-black/50 z-50 flex items-center justify-center">
          <div className="bg-vous-white border border-vous-border p-6 max-w-sm w-full mx-4">
            <p className="font-nav text-[13px] uppercase tracking-wide text-vous-black mb-2">¿Eliminar pregunta?</p>
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
