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
        <StatCard label="Total" value={String(faqs.length)} />
        <StatCard label="Activas" value={String(activeCount)} />
        <StatCard label="Inactivas" value={String(faqs.length - activeCount)} />
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
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(faq.id, faq.isActive)} title={faq.isActive ? "Desactivar" : "Activar"}>
                    {faq.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(faq)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(faq.id)} className="hover:text-red-500">
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
