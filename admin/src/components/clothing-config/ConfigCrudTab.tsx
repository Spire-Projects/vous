import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Ruler, Inbox } from "lucide-react";
import { ConfigFormDialog, type ConfigFormField } from "./ConfigFormDialog";

export interface ConfigCrudTabProps<T extends { id: string; name: string; sortOrder: number; isActive: boolean }> {
  title: string;
  subtitle?: string;
  items: T[];
  fields: ConfigFormField[];
  extraColumns?: { header: string; render: (item: T) => React.ReactNode }[];
  onCreate: (data: Record<string, string | boolean | number>) => void;
  onUpdate: (id: string, data: Record<string, string | boolean | number>) => void;
  onRemove: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onReorder: (items: { id: string; sortOrder: number }[]) => void;
}

export function ConfigCrudTab<T extends { id: string; name: string; sortOrder: number; isActive: boolean }>({
  title,
  subtitle,
  items,
  fields,
  extraColumns,
  onCreate,
  onUpdate,
  onRemove,
  onToggleActive,
  onReorder,
}: ConfigCrudTabProps<T>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const activeCount = items.filter((i) => i.isActive).length;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleSave(data: Record<string, string | boolean | number>) {
    if (editing) {
      await onUpdate(editing.id, data);
    } else {
      await onCreate({ ...data, sortOrder: items.length });
    }
  }

  async function handleDelete(item: T) {
    if (!confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;
    await onRemove(item.id);
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    onReorder(reordered.map((c, i) => ({ id: c.id, sortOrder: i })));
    setDragIdx(null);
  }

  // Template de grid para desktop
  const gridTemplate = `
    [40px] 
    minmax(140px,1fr) 
    ${extraColumns ? extraColumns.map(() => "minmax(100px,0.8fr)").join(" ") : ""}
    [80px] 
    [100px] 
    [120px]
  `;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-vous-text leading-tight tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-vous-text-secondary mt-1.5 font-sans tracking-wide leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Agregar</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Total" value={String(items.length)} icon={<Ruler size={18} />} />
        <StatCard label="Activos" value={String(activeCount)} icon={<Eye size={18} />} />
        <StatCard label="Inactivos" value={String(items.length - activeCount)} icon={<EyeOff size={18} />} />
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Inbox size={24} className="text-vous-gold/60" />
            </div>
            <p className="font-nav text-sm uppercase tracking-wider text-vous-text-secondary">
              Sin registros
            </p>
            <p className="text-xs text-vous-text-secondary/70 mt-1 font-sans">
              Presiona "Nuevo" para agregar el primero
            </p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-nav text-[13px] font-semibold text-vous-text truncate">{item.name}</p>
                {extraColumns?.map((col) => (
                  <div key={col.header} className="mt-1.5">
                    <span className="text-[10px] font-nav uppercase text-vous-text-secondary/70">{col.header}</span>
                    <div className="text-[12px] text-vous-text-secondary font-sans mt-0.5">{col.render(item)}</div>
                  </div>
                ))}
              </div>
              <Badge variant={item.isActive ? "active" : "inactive"}>
                {item.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/40">
              <span className="text-[10px] font-nav uppercase text-vous-text-secondary">
                Orden #{item.sortOrder + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onToggleActive(item.id, !item.isActive)}
                  title={item.isActive ? "Desactivar" : "Activar"}
                >
                  {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block border border-vous-border/60 rounded-2xl overflow-hidden bg-white/40">
        <div className="overflow-x-auto">
          <div
            className="min-w-[600px] grid items-center px-4 py-2.5 bg-white/80 border-b border-vous-border/40"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <span />
            <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Nombre</span>
            {extraColumns?.map((col) => (
              <span key={col.header} className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
                {col.header}
              </span>
            ))}
            <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary text-center">Orden</span>
            <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary text-center">Estado</span>
            <span />
          </div>

          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className="min-w-[600px] grid items-center px-4 py-3 border-b border-white/40 transition-colors hover:bg-amber-50/40"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <GripVertical size={16} className="text-vous-text-secondary/40 cursor-grab shrink-0 hover:text-vous-text-secondary" />

              <div className="min-w-0 pr-2">
                <p className="font-nav text-[13px] font-semibold text-vous-text truncate">{item.name}</p>
              </div>

              {extraColumns?.map((col) => (
                <div key={col.header} className="text-[12px] text-vous-text-secondary font-sans pr-2">
                  {col.render(item)}
                </div>
              ))}

              <span className="font-nav text-[12px] text-vous-text-secondary text-center tabular-nums">
                {item.sortOrder + 1}
              </span>

              <div className="flex justify-center">
                <Badge variant={item.isActive ? "active" : "inactive"}>
                  {item.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="flex items-center justify-end gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onToggleActive(item.id, !item.isActive)}
                  title={item.isActive ? "Desactivar" : "Activar"}
                >
                  {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Inbox size={24} className="text-vous-gold/60" />
            </div>
            <p className="font-nav text-sm uppercase tracking-wider text-vous-text-secondary">
              Sin registros
            </p>
            <p className="text-xs text-vous-text-secondary/70 mt-1 font-sans">
              Presiona "Agregar" para crear el primero
            </p>
          </div>
        )}
      </div>

      <ConfigFormDialog<T>
        open={dialogOpen}
        title={title}
        editing={editing}
        fields={fields}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
