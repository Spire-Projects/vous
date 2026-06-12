import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { FaqFormDialog } from "@/components/faq/FaqFormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useFAQs } from "@/hooks/useFaqs";
import type { FAQ, CreateFAQInput } from "@/domain/entities/faq.entity";

export function FaqPage() {
  const { faqs, loading, create, update, remove, toggleActive, reorder } = useFAQs();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

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

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...faqs];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    reorder(reordered.map((f, i) => ({ id: f.id, order: i })));
    setDragIdx(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Preguntas Frecuentes"
        subtitle="Gestión de FAQs para la landing de VOUS."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Nueva pregunta</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(faqs.length)} />
        <StatCard label="Activas" value={String(activeCount)} />
        <StatCard label="Inactivas" value={String(faqs.length - activeCount)} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">
            Cargando preguntas...
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-vous-text-secondary font-sans text-sm">
            No hay preguntas. Crea la primera.
          </div>
        ) : (
          <div className="divide-y divide-white/30">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={`flex items-start gap-3 p-4 hover:bg-amber-50/30 transition-colors ${dragIdx === idx ? "opacity-40" : ""}`}
              >
                <GripVertical size={16} className="text-vous-text-muted mt-0.5 shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Pregunta</span>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-nav text-[13px] font-semibold text-vous-text">{faq.question}</p>
                    <Badge variant={faq.isActive ? "active" : "inactive"} className="font-nav text-[10px] uppercase tracking-wide">
                      {faq.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden">Respuesta</span>
                  <div
                    className="text-[12px] text-vous-text-secondary font-sans line-clamp-2 faq-answer-preview [&_strong]:font-semibold [&_em]:italic [&_p]:inline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary block md:hidden mt-1">Orden</span>
                  <p className="text-[10px] text-vous-text-muted font-nav mt-1">Orden: {faq.order}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(faq.id, faq.isActive)} title={faq.isActive ? "Desactivar" : "Activar"}>
                    {faq.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(faq)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(faq.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FaqFormDialog open={dialogOpen} faq={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="¿Eliminar pregunta?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}
