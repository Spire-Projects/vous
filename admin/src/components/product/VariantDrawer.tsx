import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VariantFormDialog } from "./VariantFormDialog";
import { useVariants } from "@/hooks/useVariants";
import type { Product } from "@/domain/entities/product.entity";
import type { CreateVariantInput } from "@/domain/entities/product.entity";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

interface VariantDrawerProps {
  product: Product | null;
  onClose: () => void;
}

export function VariantDrawer({ product, onClose }: VariantDrawerProps) {
  const { variants, loading, create, update, remove } = useVariants(product?.id ?? null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingVariant = variants.find((v) => v.id === editingId) ?? null;

  async function handleSave(data: CreateVariantInput) {
    if (editingId) await update(editingId, data);
    else await create(data);
    setEditingId(null);
  }

  async function handleDelete() {
    if (deletingId) await remove(deletingId);
    setDeletingId(null);
  }

  return (
    <>
      <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package size={16} />
              Variantes — {product?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => { setEditingId(null); setFormOpen(true); }}>
              <Plus size={13} strokeWidth={2} /> Nueva variante
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-sm text-vous-text-secondary py-8">Cargando…</p>
          ) : variants.length === 0 ? (
            <p className="text-center text-sm text-vous-text-secondary py-8">Sin variantes. Crea la primera.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Talla</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.size ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {v.colorHex && (
                          <span
                            className="w-4 h-4 rounded-full border border-vous-border inline-block"
                            style={{ background: v.colorHex }}
                          />
                        )}
                        {v.color ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={v.stock <= 0 ? "text-red-600 font-semibold" : v.stock <= 5 ? "text-amber-600 font-semibold" : ""}>
                        {v.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-vous-text-secondary text-xs">{v.sku ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={v.isActive ? "active" : "inactive"}>{v.isActive ? "Activa" : "Inactiva"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setEditingId(v.id); setFormOpen(true); }}>
                          <Pencil size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-600 hover:text-red-700" onClick={() => setDeletingId(v.id)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <VariantFormDialog
        key={editingVariant?.id ?? (formOpen ? "new" : "closed")}
        open={formOpen}
        variant={editingVariant}
        onClose={() => { setFormOpen(false); setEditingId(null); }}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={!!deletingId}
        title="Eliminar variante"
        description="¿Seguro que deseas eliminar esta variante? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}
