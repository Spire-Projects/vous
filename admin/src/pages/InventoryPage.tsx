import { useState } from "react";
import { Search, Plus, Pencil, MoreVertical, AlertTriangle, Eye, EyeOff, Maximize2, X, Star, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [preview, setPreview] = useState<Product | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

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
                {["Img", "Producto", "Categoría", "Precio", "Variantes", "Stock", "Estado", ""].map((h) => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  {/* Thumbnail */}
                  <TableCell className="w-14">
                    {product.images[0] ? (
                      <button
                        onClick={() => { setPreview(product); setPreviewImg(product.images[0]); }}
                        className="w-11 h-11 rounded border border-vous-border overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <div className="w-11 h-11 rounded border border-vous-border bg-vous-bg flex items-center justify-center">
                        <Package size={16} className="text-vous-gray" />
                      </div>
                    )}
                  </TableCell>

                  {/* Producto */}
                  <TableCell>
                    <p className="font-nav text-[13px] font-semibold text-vous-black">{product.name}</p>
                    <p className="text-[11px] text-vous-gray font-sans">{product.slug}</p>
                    {product.badge && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-nav uppercase tracking-wider bg-vous-black text-vous-white rounded">{product.badge}</span>
                    )}
                  </TableCell>

                  {/* Categoría */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">{product.categoryName}</TableCell>

                  {/* Precio */}
                  <TableCell>
                    <p className="text-[13px] font-nav font-semibold text-vous-black">
                      Bs. {product.price.toLocaleString("es-BO")}
                      {product.isDiscounted && product.discountPercentage ? (
                        <span className="ml-1.5 text-[10px] text-red-500">-{product.discountPercentage}%</span>
                      ) : null}
                    </p>
                    {product.wholesalePrice ? (
                      <p className="text-[11px] text-vous-gray font-sans">Mayor: Bs. {product.wholesalePrice.toLocaleString("es-BO")}</p>
                    ) : null}
                  </TableCell>

                  {/* Variantes */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {product.colors.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.colors.slice(0, 5).map((c) => (
                            <span key={c.hex} title={c.name} className="w-4 h-4 rounded-full border border-vous-border inline-block" style={{ background: c.hex }} />
                          ))}
                          {product.colors.length > 5 && <span className="text-[10px] text-vous-gray">+{product.colors.length - 5}</span>}
                        </div>
                      )}
                      {product.sizes.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.sizes.slice(0, 4).map((s) => (
                            <span key={s} className="px-1 py-0.5 text-[9px] font-nav uppercase border border-vous-border rounded">{s}</span>
                          ))}
                          {product.sizes.length > 4 && <span className="text-[10px] text-vous-gray">+{product.sizes.length - 4}</span>}
                        </div>
                      )}
                      {product.colors.length === 0 && product.sizes.length === 0 && (
                        <span className="text-[11px] text-vous-gray font-sans">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <span className={`font-nav text-[13px] font-semibold ${product.stock <= 5 ? "text-red-600" : "text-vous-black"}`}>{product.stock}</span>
                    {product.stock <= 5 && <span className="ml-1.5 text-[10px] font-nav text-red-500 uppercase">CRÍTICO</span>}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={product.isActive ? "active" : "inactive"}>{product.isActive ? "Activo" : "Inactivo"}</Badge>
                      {product.isFeatured && (
                        <span className="flex items-center gap-0.5 text-[10px] font-nav text-amber-500 uppercase"><Star size={10} fill="currentColor" />Destacado</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setPreview(product); setPreviewImg(product.images[0] ?? null); }} title="Ver detalle">
                        <Maximize2 size={13} />
                      </Button>
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

      {/* Product Detail Modal */}
      <Dialog open={!!preview} onOpenChange={(o) => { if (!o) { setPreview(null); setPreviewImg(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="font-nav text-[16px] tracking-widest uppercase">{preview.name}</DialogTitle>
                <p className="text-[11px] text-vous-gray font-sans">{preview.slug} · {preview.categoryName}</p>
              </DialogHeader>

              {/* Images */}
              {preview.images.length > 0 && (
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] bg-vous-bg rounded overflow-hidden">
                    <img src={previewImg ?? preview.images[0]} alt={preview.name} className="w-full h-full object-cover" />
                  </div>
                  {preview.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {preview.images.map((img, i) => (
                        <button key={i} onClick={() => setPreviewImg(img)}
                          className={`w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden transition-colors ${
                            (previewImg ?? preview.images[0]) === img ? "border-vous-black" : "border-vous-border"
                          }`}>
                          <img src={img} alt={`${preview.name} ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 text-[12px] font-sans">
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Precio</p>
                  <p className="text-[15px] font-nav font-semibold text-vous-black">Bs. {preview.price.toLocaleString("es-BO")}</p>
                  {preview.isDiscounted && preview.discountPercentage ? (
                    <p className="text-[11px] text-red-500">Descuento: {preview.discountPercentage}%</p>
                  ) : null}
                  {preview.wholesalePrice ? (
                    <p className="text-[11px] text-vous-gray">Mayorista: Bs. {preview.wholesalePrice.toLocaleString("es-BO")}</p>
                  ) : null}
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Stock</p>
                  <p className={`text-[15px] font-nav font-semibold ${preview.stock <= 5 ? "text-red-600" : "text-vous-black"}`}>{preview.stock} unidades</p>
                </div>
                {preview.description && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Descripción</p>
                    <p className="text-vous-gray leading-relaxed">{preview.description}</p>
                  </div>
                )}
                {preview.detail && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Detalle</p>
                    <p className="text-vous-gray leading-relaxed">{preview.detail}</p>
                  </div>
                )}
                {preview.colors.length > 0 && (
                  <div>
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Colores</p>
                    <div className="flex flex-wrap gap-2">
                      {preview.colors.map((c) => (
                        <span key={c.hex} className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full border border-vous-border" style={{ background: c.hex }} />
                          <span className="text-vous-gray">{c.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {preview.sizes.length > 0 && (
                  <div>
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Tallas</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.sizes.map((s) => (
                        <span key={s} className="px-2 py-1 text-[11px] font-nav uppercase border border-vous-border rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {preview.materials.length > 0 && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Materiales</p>
                    <p className="text-vous-gray">{preview.materials.join(", ")}</p>
                  </div>
                )}
                {preview.tags && preview.tags.length > 0 && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] bg-vous-bg border border-vous-border rounded font-sans">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Estado</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={preview.isActive ? "active" : "inactive"}>{preview.isActive ? "Activo" : "Inactivo"}</Badge>
                    {preview.isFeatured && <span className="flex items-center gap-0.5 text-[10px] font-nav text-amber-500 uppercase"><Star size={10} fill="currentColor" />Destacado</span>}
                    {preview.badge && <span className="px-1.5 py-0.5 text-[9px] font-nav uppercase tracking-wider bg-vous-black text-vous-white rounded">{preview.badge}</span>}
                  </div>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-gray mb-1">Creado</p>
                  <p className="text-vous-gray">{new Date(preview.createdAt).toLocaleDateString("es-BO", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-vous-border">
                <Button variant="outline" onClick={() => { setPreview(null); setPreviewImg(null); }}>
                  <X size={13} /> Cerrar
                </Button>
                <Button onClick={() => { handleEdit(preview); setPreview(null); setPreviewImg(null); }}>
                  <Pencil size={13} /> Editar producto
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
