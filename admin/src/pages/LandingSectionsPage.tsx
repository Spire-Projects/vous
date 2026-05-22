import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Package,
  LayoutGrid,
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
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  red: "bg-red-100 text-red-800 border-red-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function LandingSectionsPage() {
  const { sections, loading, error, create, update, remove, toggleActive, reorder, updateProducts } =
    useLandingSections();
  const { products } = useProducts();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LandingSection | null>(null);
  const [pickerSection, setPickerSection] = useState<LandingSection | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeCount = sections.filter((s) => s.active).length;
  const totalProducts = sections.reduce((acc, s) => acc + s.productIds.length, 0);

  function handleNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(section: LandingSection) {
    setEditing(section);
    setFormOpen(true);
  }

  async function handleSave(data: CreateLandingSectionInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const reordered = [...sections];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    await reorder(reordered);
  }

  async function handleMoveDown(index: number) {
    if (index === sections.length - 1) return;
    const reordered = [...sections];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    await reorder(reordered);
  }

  const activeProducts = products.filter((p) => p.isActive);

  return (
    <div className="p-8">
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

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(sections.length)} />
        <StatCard label="Activas" value={String(activeCount)} />
        <StatCard label="Inactivas" value={String(sections.length - activeCount)} />
        <StatCard label="Productos configurados" value={String(totalProducts)} />
      </div>

      <div className="bg-vous-white border border-vous-border">
        {loading ? (
          <div className="p-12 text-center text-vous-gray font-nav text-[11px] uppercase tracking-wider">
            Cargando secciones…
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="font-sans text-sm text-red-500">{error}</p>
            <p className="font-sans text-xs text-vous-gray mt-1">
              No se pudieron cargar las secciones. Revisa tu conexión e intenta de nuevo.
            </p>
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center">
            <LayoutGrid size={32} className="mx-auto text-vous-gray-light mb-3" />
            <p className="font-sans text-sm text-vous-gray">
              No hay secciones. Crea la primera para mostrar productos en la landing.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Orden</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-40">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section, index) => {
                const color =
                  TYPE_BADGE_CLASSES[LANDING_SECTION_TYPE_COLORS[section.type]] ??
                  TYPE_BADGE_CLASSES.amber;
                return (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          aria-label="Mover arriba"
                          title="Mover arriba"
                          className="p-0.5 text-vous-gray-light hover:text-vous-black disabled:opacity-25"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <span className="font-nav text-[11px] text-vous-gray">{index + 1}</span>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sections.length - 1}
                          aria-label="Mover abajo"
                          title="Mover abajo"
                          className="p-0.5 text-vous-gray-light hover:text-vous-black disabled:opacity-25"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-nav text-[13px] font-semibold text-vous-black">
                        {section.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-nav font-semibold tracking-wide border ${color}`}
                      >
                        {LANDING_SECTION_TYPE_LABELS[section.type]}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-sans text-sm text-vous-gray">
                        {section.productIds.length}
                        <span className="text-vous-gray-light text-[10px]"> / 8</span>
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
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title={section.active ? "Desactivar" : "Activar"}
                          onClick={() => toggleActive(section.id, section.active)}
                        >
                          {section.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Gestionar productos"
                          onClick={() => setPickerSection(section)}
                        >
                          <Package size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Editar sección"
                          onClick={() => handleEdit(section)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-red-400 hover:text-red-600"
                          title="Eliminar sección"
                          onClick={() => setConfirmDelete(section.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
