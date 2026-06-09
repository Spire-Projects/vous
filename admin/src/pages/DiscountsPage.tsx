import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Power, PowerOff, Tag } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useDiscounts } from "@/hooks/useDiscounts";
import type { Discount, DiscountType, DiscountScope, CreateDiscountInput, UpdateDiscountInput } from "@/domain/entities/discount.entity";

const SCOPE_LABELS: Record<DiscountScope, string> = {
  all: "Todos los productos",
  categories: "Por categorías",
  products: "Por productos",
};

const TYPE_LABELS: Record<DiscountType, string> = {
  percentage: "Porcentaje (%)",
  fixed: "Monto fijo (Bs.)",
};

export function DiscountsPage() {
  const { discounts, loading, create, update, remove, toggleActive } = useDiscounts();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CreateDiscountInput>({
    code: "",
    description: "",
    type: "percentage",
    value: 10,
    minPurchase: undefined,
    maxUses: null,
    isActive: true,
    applicableTo: "all",
    categoryIds: [],
    productIds: [],
    startDate: undefined,
    endDate: null,
  });

  const filtered = discounts.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.code.toLowerCase().includes(q) || (d.description ?? "").toLowerCase().includes(q);
  });

  function openNew() {
    setEditing(null);
    setForm({
      code: "",
      description: "",
      type: "percentage",
      value: 10,
      minPurchase: undefined,
      maxUses: null,
      isActive: true,
      applicableTo: "all",
      categoryIds: [],
      productIds: [],
      startDate: undefined,
      endDate: null,
    });
    setDialogOpen(true);
  }

  function openEdit(discount: Discount) {
    setEditing(discount);
    setForm({
      code: discount.code,
      description: discount.description,
      type: discount.type,
      value: discount.value,
      minPurchase: discount.minPurchase,
      maxUses: discount.maxUses,
      isActive: discount.isActive,
      applicableTo: discount.applicableTo,
      categoryIds: discount.categoryIds,
      productIds: discount.productIds,
      startDate: discount.startDate,
      endDate: discount.endDate,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.code.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const payload: UpdateDiscountInput = { ...form };
        await update(editing.id, payload);
      } else {
        await create(form);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  function formatValidity(discount: Discount): string {
    const start = discount.startDate ? new Date(discount.startDate).toLocaleDateString("es-BO") : null;
    const end = discount.endDate ? new Date(discount.endDate).toLocaleDateString("es-BO") : null;
    if (start && end) return `${start} → ${end}`;
    if (start) return `Desde ${start}`;
    if (end) return `Hasta ${end}`;
    return "Sin límite";
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Descuentos y Cupones"
        subtitle="Configura promociones y códigos de descuento."
        action={<Button onClick={openNew}><Plus size={14} strokeWidth={2} />Nuevo Cupón</Button>}
      />

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-4 border-b border-white/40 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-secondary" />
            <Input
              placeholder="Buscar código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="inline-block w-5 h-5 border-2 border-vous-border border-t-vous-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-white/30">
              {filtered.map((d) => (
                <div key={d.id} className="p-4 hover:bg-amber-50/30 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Código</p>
                      <div className="flex items-center gap-1.5">
                        <Tag size={14} className="text-vous-gold" />
                        <span className="font-nav text-[13px] font-semibold text-vous-text">{d.code}</span>
                      </div>
                      {d.description && (
                        <p className="text-[11px] text-vous-text-secondary font-sans mt-0.5">{d.description}</p>
                      )}
                    </div>
                    <Badge variant={d.isActive ? "active" : "inactive"}>
                      {d.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Tipo</p>
                      <Badge variant="outline">{TYPE_LABELS[d.type]}</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Valor</p>
                      <p className="font-nav text-[13px] font-semibold text-vous-text">
                        {d.type === "percentage" ? `${d.value}%` : `Bs. ${d.value}`}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Aplica a</p>
                      <p className="text-[12px] font-sans text-vous-text-secondary">{SCOPE_LABELS[d.applicableTo]}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Usos</p>
                      <p className="text-[12px] font-sans text-vous-text-secondary">
                        {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ""}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Vigencia</p>
                    <p className="text-[11px] font-sans text-vous-text-secondary">{formatValidity(d)}</p>
                  </div>
                  <div className="flex items-center gap-1 pt-1 border-t border-white/30">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toggleActive(d.id, d.isActive)}
                      title={d.isActive ? "Desactivar" : "Activar"}
                    >
                      {d.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(d)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setConfirmDelete(d.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-6 text-center text-vous-text-secondary text-sm font-nav">
                  {search ? "No se encontraron cupones con ese filtro." : "No hay cupones configurados."}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Código", "Tipo", "Valor", "Aplica a", "Usos", "Vigencia", "Estado", ""].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-vous-gold" />
                          <span className="font-nav text-[13px] font-semibold text-vous-text">{d.code}</span>
                        </div>
                        {d.description && (
                          <p className="text-[11px] text-vous-text-secondary font-sans mt-0.5">{d.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{TYPE_LABELS[d.type]}</Badge>
                      </TableCell>
                      <TableCell className="font-nav text-[13px] font-semibold text-vous-text">
                        {d.type === "percentage" ? `${d.value}%` : `Bs. ${d.value}`}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {SCOPE_LABELS[d.applicableTo]}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ""}
                      </TableCell>
                      <TableCell className="text-[11px] font-sans text-vous-text-secondary">
                        {formatValidity(d)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.isActive ? "active" : "inactive"}>
                          {d.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => toggleActive(d.id, d.isActive)}
                            title={d.isActive ? "Desactivar" : "Activar"}
                          >
                            {d.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(d)}>
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setConfirmDelete(d.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center text-vous-text-secondary text-sm font-nav">
                        {search ? "No se encontraron cupones con ese filtro." : "No hay cupones configurados."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && (
          <div className="px-4 py-3 border-t border-white/40">
            <p className="text-[11px] text-vous-text-secondary font-nav">
              Mostrando {filtered.length} de {discounts.length} cupones
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cupón" : "Nuevo Cupón"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos del código de descuento." : "Crea un nuevo código de descuento promocional."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Código *</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Ej: VOUS10"
                className="uppercase"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ej: 10% de descuento en primera compra"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de descuento</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: DiscountType) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed">Monto fijo (Bs.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  min={0}
                  max={form.type === "percentage" ? 90 : undefined}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Aplicar a</Label>
              <Select
                value={form.applicableTo}
                onValueChange={(v: DiscountScope) => setForm({ ...form, applicableTo: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los productos</SelectItem>
                  <SelectItem value="categories">Por categorías</SelectItem>
                  <SelectItem value="products">Por productos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Compra mínima (Bs.)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.minPurchase ?? ""}
                  onChange={(e) => setForm({ ...form, minPurchase: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Opcional"
                />
              </div>
              <div>
                <Label>Máximo de usos</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxUses ?? ""}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Ilimitado"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(c) => setForm({ ...form, isActive: Boolean(c) })}
                id="dc-active"
              />
              <Label htmlFor="dc-active" className="cursor-pointer">Cupón activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => void handleSave()} disabled={saving || !form.code.trim()}>
              {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="Eliminar cupón"
        description="Esta acción eliminará el código de descuento permanentemente. No se puede deshacer."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}
