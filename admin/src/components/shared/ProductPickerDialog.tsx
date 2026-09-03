import { useState, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/domain/entities/product.entity";

const MAX_PRODUCTS = 8;

interface ProductPickerDialogProps {
  open: boolean;
  sectionName: string;
  allProducts: Product[];
  selectedIds: string[];
  onClose: () => void;
  onSave: (productIds: string[]) => Promise<void>;
}

export function ProductPickerDialog({
  open,
  sectionName,
  allProducts,
  selectedIds,
  onClose,
  onSave,
}: ProductPickerDialogProps) {
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return allProducts;
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
    );
  }, [allProducts, search]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_PRODUCTS) return prev;
      return [...prev, id];
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-nav text-[13px] uppercase tracking-widest">
            Productos — {sectionName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between text-[11px] font-nav text-vous-text-secondary px-0 pb-1">
          <span>{selected.length} seleccionados (máx. {MAX_PRODUCTS})</span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X size={10} />
              Limpiar selección
            </button>
          )}
        </div>

        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-muted"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto…"
            className="pl-8"
          />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/30 min-h-0">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-vous-text-secondary font-sans text-sm">
              No hay productos activos.
            </p>
          ) : (
            filtered.map((product) => {
              const isSelected = selected.includes(product.id);
              const isDisabled = !isSelected && selected.length >= MAX_PRODUCTS;
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggle(product.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                    isSelected
                      ? "bg-vous-gold/10"
                      : isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-amber-50/40"
                  }`}
                >
                  <div
                    className={`w-5 h-5 shrink-0 border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-vous-gold border-vous-gold"
                        : "border-vous-border"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} className="text-vous-text" />}
                  </div>
                  <div className="w-10 h-10 shrink-0 bg-white/90 overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/90" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-nav text-[12px] font-semibold text-vous-text truncate">
                      {product.name}
                    </p>
                    <p className="font-sans text-[11px] text-vous-text-secondary">
                      {product.categoryName} · Bs.{" "}
                      {product.price.toLocaleString("es-BO")}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-white/40">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? "Guardando…" : `Guardar (${selected.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
