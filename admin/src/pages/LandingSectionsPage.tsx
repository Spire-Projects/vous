import { useState } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Package, LayoutGrid, GripVertical,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LandingSectionFormDialog } from "@/components/shared/LandingSectionFormDialog";
import { ProductPickerDialog } from "@/components/shared/ProductPickerDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useLandingSections } from "@/hooks/useLandingSections";
import { useProducts } from "@/hooks/useProducts";
import type { LandingSection, CreateLandingSectionInput } from "@/domain/entities/landing-section.entity";
import { LANDING_SECTION_TYPE_LABELS, LANDING_SECTION_TYPE_COLORS } from "@/domain/entities/landing-section.entity";

const TYPE_BADGE_CLASSES: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-950/30 text-blue-700 border-blue-800/40",
  red: "bg-red-50 text-red-700 border-red-800/40",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function LandingSectionsPage() {
  const { sections, loading, error, create, update, remove, toggleActive, reorder, updateProducts } =
    useLandingSections();
  const { products } = useProducts();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LandingSection | null>(null);
  const [pickerSection, setPickerSection] = useState<LandingSection | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const activeCount = sections.filter((s) => s.active).length;
  const totalProducts = sections.reduce((acc, s) => acc + s.productIds.length, 0);

  function handleNew() { setEditing(null); setFormOpen(true); }
  function handleEdit(section: LandingSection) { setEditing(section); setFormOpen(true); }

  async function handleSave(data: CreateLandingSectionInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    reorder(reordered);
    setDragIdx(null);
  }

  const activeProducts = products.filter((p) => p.isActive);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Secciones de Landing"
        subtitle="Configura las secciones de productos destacados que aparecen en la página principal."
        action={
          <Button onClick={handleNew}>
            <Plus size={14} strokeWidth={2} />
            Nueva sección
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(sections.length)} />
        <StatCard label="Activas" value={String(activeCount)} />
        <StatCard label="Inactivas" value={String(sections.length - activeCount)} />
        <StatCard label="Productos configurados" value={String(totalProducts)} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">
            Cargando secciones…
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="font-sans text-sm text-red-600">{error}</p>
            <p className="font-sans text-xs text-vous-text-secondary mt-1">
              No se pudieron cargar las secciones. Revisa tu conexión e intenta de nuevo.
            </p>
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center">
            <LayoutGrid size={32} className="mx-auto text-vous-text-muted mb-3" />
            <p className="font-sans text-sm text-vous-text-secondary">
              No hay secciones. Crea la primera para mostrar productos en la landing.
            </p>
          </div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-white/30">
              {sections.map((section) => {
                const color =
                  TYPE_BADGE_CLASSES[LANDING_SECTION_TYPE_COLORS[section.type]] ??
                  TYPE_BADGE_CLASSES.amber;
                return (
                  <div key={section.id} className="p-4 hover:bg-amber-50/30 transition-colors space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Sección</p>
                        <p className="font-nav text-[13px] font-semibold text-vous-text">{section.name}</p>
                      </div>
                      <Badge
                        variant={section.active ? "active" : "inactive"}
                        className="font-nav text-[10px] uppercase tracking-wide"
                      >
                        {section.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Tipo</p>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-nav font-semibold tracking-wide border ${color}`}>
                          {section.customType || LANDING_SECTION_TYPE_LABELS[section.type]}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Productos</p>
                        <span className="font-sans text-sm text-vous-text-secondary">
                          {section.productIds.length}
                          <span className="text-vous-text-muted text-[10px]"> / 8</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-1 border-t border-white/30 flex-wrap">
                      <Button variant="ghost" size="icon-sm" title={section.active ? "Desactivar" : "Activar"} onClick={() => toggleActive(section.id, section.active)}>
                        {section.active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Gestionar productos" onClick={() => setPickerSection(section)}>
                        <Package size={14} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Editar sección" onClick={() => handleEdit(section)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-red-600 hover:text-red-700" title="Eliminar sección" onClick={() => setConfirmDelete(section.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Orden</TableHead>
                    <TableHead>Sección</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Productos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="min-w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section, index) => {
                    const color =
                      TYPE_BADGE_CLASSES[LANDING_SECTION_TYPE_COLORS[section.type]] ??
                      TYPE_BADGE_CLASSES.amber;
                    return (
                      <TableRow
                        key={section.id}
                        draggable
                        onDragStart={() => setDragIdx(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        className={dragIdx === index ? "opacity-40" : ""}
                      >
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <GripVertical size={15} className="text-vous-text-muted cursor-grab shrink-0" />
                            <span className="font-nav text-[11px] text-vous-text-secondary">{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-nav text-[13px] font-semibold text-vous-text">{section.name}</p>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-nav font-semibold tracking-wide border ${color}`}>
                            {section.customType || LANDING_SECTION_TYPE_LABELS[section.type]}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-sans text-sm text-vous-text-secondary">
                            {section.productIds.length}
                            <span className="text-vous-text-muted text-[10px]"> / 8</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={section.active ? "active" : "inactive"}
                            className="font-nav text-[10px] uppercase tracking-wide"
                          >
                            {section.active ? "Activa" : "Inactiva"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button variant="ghost" size="icon-sm" title={section.active ? "Desactivar" : "Activar"} onClick={() => toggleActive(section.id, section.active)}>
                              {section.active ? <EyeOff size={14} /> : <Eye size={14} />}
                            </Button>
                            <Button variant="ghost" size="icon-sm" title="Gestionar productos" onClick={() => setPickerSection(section)}>
                              <Package size={14} />
                            </Button>
                            <Button variant="ghost" size="icon-sm" title="Editar sección" onClick={() => handleEdit(section)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="text-red-600 hover:text-red-700" title="Eliminar sección" onClick={() => setConfirmDelete(section.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <LandingSectionFormDialog
        key={editing?.id ?? (formOpen ? "new" : "closed")}
        open={formOpen}
        section={editing}
        nextOrder={sections.length}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      {pickerSection && (
        <ProductPickerDialog
          key={`picker-${pickerSection.id}`}
          open={!!pickerSection}
          sectionName={pickerSection.name}
          allProducts={activeProducts}
          selectedIds={pickerSection.productIds}
          onClose={() => setPickerSection(null)}
          onSave={(ids) => updateProducts(pickerSection.id, ids)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="Eliminar sección"
        description="La sección desaparecerá de la landing page. Esta acción no se puede deshacer."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}
