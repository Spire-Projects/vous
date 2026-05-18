import { useState } from "react";
import { Search, Plus, Pencil, MoreVertical, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ProductFormDialog } from "@/components/product/ProductFormDialog";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { Product, CreateProductInput } from "@/domain/entities/product.entity";

export function InventoryPage() {
  const { products, loading, create, update, toggleActive } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchLow = !filterLowStock || (p.stock <= 5);
    return matchSearch && matchLow;
  });

  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(product: Product) { setEditing(product); setDialogOpen(true); }

  async function handleSave(data: CreateProductInput) {
    if (editing) await update(editing.id, data);
    else await create(data);
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Inventario de Productos"
        subtitle="Gestione su catálogo con precisión editorial."
        action={<Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Añadir Producto</Button>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Productos" value={String(products.length)} />
        <StatCard label="Activos" value={String(activeCount)} />
        <StatCard label="Stock Crítico" value={String(lowStockCount)} />
      </div>

      <div className="bg-vous-white border border-vous-border">
        <div className="p-4 border-b border-vous-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
            <Input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button
            variant={filterLowStock ? "danger" : "outline"}
            size="sm"
            onClick={() => setFilterLowStock((v) => !v)}
            className="gap-1.5"
          >
            <AlertTriangle size={13} /> Stock Crítico
          </Button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-vous-gray font-nav text-[11px] uppercase tracking-wider">Cargando productos...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Producto", "Categoría", "Precio", "Stock", "Estado", ""].map((h) => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-nav text-[13px] font-semibold text-vous-black">{product.name}</p>
                    <p className="text-[11px] text-vous-gray font-sans">{product.slug}</p>
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">{product.categoryName}</TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    Bs. {product.price.toLocaleString("es-BO")}
                    {product.isDiscounted && product.discountPercentage ? (
                      <span className="ml-1.5 text-[10px] font-nav text-red-500">-{product.discountPercentage}%</span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <span className={`font-nav text-[13px] font-semibold ${product.stock <= 5 ? "text-red-600" : "text-vous-black"}`}>{product.stock}</span>
                    {product.stock <= 5 && <span className="ml-1.5 text-[10px] font-nav text-red-500 uppercase">CRÍTICO</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "active" : "inactive"}>{product.isActive ? "Activo" : "Inactivo"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(product.id, product.isActive)} title={product.isActive ? "Desactivar" : "Activar"}>
                        {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(product)}><Pencil size={14} /></Button>
                      <Button variant="ghost" size="icon-sm"><MoreVertical size={16} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ProductFormDialog open={dialogOpen} product={editing} categories={categories} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </div>
  );
}
