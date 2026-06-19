import { useState, useEffect } from "react";
import { Search, Plus, Pencil, AlertTriangle, Eye, EyeOff, Maximize2, X, Star, Package, Trash2, Settings2, Layers, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductFormDialog } from "@/components/product/ProductFormDialog";
import { ProductFlagsDialog } from "@/components/product/ProductFlagsDialog";
import { CategoryDiscountDialog } from "@/components/product/CategoryDiscountDialog";
import { VariantDrawer } from "@/components/product/VariantDrawer";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import type { Product, CreateProductInput, CreateVariantInput, ProductVariant } from "@/domain/entities/product.entity";

export function InventoryPage() {
  const { products, loading, createWithVariants, addVariants, update, toggleActive, remove, setFlags, applyDiscount, applyCatDiscount, adjustWholesaleStock, reorder } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [preview, setPreview] = useState<Product | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewVariants, setPreviewVariants] = useState<ProductVariant[]>([]);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [flagsProduct, setFlagsProduct] = useState<Product | null>(null);
  const [categoryDiscountOpen, setCategoryDiscountOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Expanded rows for inline variant viewing
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [variantsMap, setVariantsMap] = useState<Record<string, ProductVariant[]>>({});
  const [variantsLoadingMap, setVariantsLoadingMap] = useState<Record<string, boolean>>({});

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchLow = !filterLowStock || (p.stock <= 5);
    return matchSearch && matchLow;
  });

  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Load variants when opening product preview
  useEffect(() => {
    if (!preview) {
      setPreviewVariants([]);
      return;
    }
    firestoreProductRepository.findVariants(preview.id)
      .then((data) => setPreviewVariants(data))
      .catch(() => setPreviewVariants([]));
  }, [preview?.id]);

  async function toggleExpand(productId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
    if (!variantsMap[productId] && !variantsLoadingMap[productId]) {
      setVariantsLoadingMap((m) => ({ ...m, [productId]: true }));
      try {
        const data = await firestoreProductRepository.findVariants(productId);
        setVariantsMap((m) => ({ ...m, [productId]: data }));
      } catch {
        setVariantsMap((m) => ({ ...m, [productId]: [] }));
      } finally {
        setVariantsLoadingMap((m) => ({ ...m, [productId]: false }));
      }
    }
  }

  function handleNew() { setEditing(null); setDialogOpen(true); }
  function handleEdit(product: Product) { setEditing(product); setDialogOpen(true); }

  async function handleSave(data: CreateProductInput, variants: CreateVariantInput[]) {
    if (editing) {
      await update(editing.id, data);
      if (variants.length > 0) {
        await addVariants(editing.id, variants);
      }
    } else {
      await createWithVariants(data, variants);
    }
  }

  async function handleDelete(id: string) {
    await remove(id);
    setConfirmDelete(null);
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...filtered];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    const ordered = reordered.map((p, i) => ({ id: p.id, sortOrder: i }));
    reorder(ordered);
    setDragIdx(null);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Inventario de Productos"
        subtitle="Gestione su catálogo con precisión editorial."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setCategoryDiscountOpen(true)} title="Descuento por categoría">
              <Layers size={14} strokeWidth={2} />Descuento Cat.
            </Button>
            <Button onClick={handleNew}><Plus size={14} strokeWidth={2} />Añadir Producto</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Productos" value={String(products.length)} />
        <StatCard label="Activos" value={String(activeCount)} />
        <StatCard label="Stock Crítico" value={String(lowStockCount)} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-4 border-b border-white/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-secondary" />
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
          <div className="p-12 text-center text-vous-text-secondary font-nav text-[11px] uppercase tracking-wider">Cargando productos...</div>
        ) : (
          <>
            {/* ── Mobile: cards ───────────────────────────────────────── */}
            <div className="block md:hidden divide-y divide-white/30">
              {filtered.map((product) => (
                <div key={product.id} className="p-4 hover:bg-amber-50/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    {product.images[0] ? (
                      <button onClick={() => { setPreview(product); setPreviewImg(product.images[0]); }} className="w-12 h-12 border border-vous-border overflow-hidden shrink-0 bg-white/90">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <div className="w-12 h-12 border border-vous-border bg-vous-surface flex items-center justify-center shrink-0">
                        <Package size={16} className="text-vous-text-secondary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-nav text-[13px] font-semibold text-vous-text truncate">{product.name}</p>
                      <p className="text-[11px] text-vous-text-secondary font-sans truncate">{product.categoryName}</p>
                      {product.badge && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-nav uppercase tracking-wider bg-vous-text text-vous-bg">{product.badge}</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] mb-3">
                    <div>
                      <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Precio</span>
                      <p className="text-vous-text font-semibold mt-0.5">
                        Bs. {product.price.toLocaleString("es-BO")}
                        {product.isDiscounted && product.discountPercentage ? <span className="ml-1 text-[10px] text-red-600">-{product.discountPercentage}%</span> : null}
                      </p>
                      {product.wholesalePrice && <p className="text-[11px] text-vous-text-secondary">May: Bs. {product.wholesalePrice.toLocaleString("es-BO")}</p>}
                    </div>
                    <div>
                      <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Stock</span>
                      <p className={`font-nav font-semibold mt-0.5 ${product.stock <= 5 ? "text-red-600" : "text-vous-text"}`}>
                        {product.stock} {product.stock <= 5 && <span className="text-[10px] uppercase">CRÍTICO</span>}
                      </p>
                    </div>
                    {product.colors.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Colores</span>
                        <div className="flex items-center gap-1 flex-wrap mt-0.5">
                          {product.colors.slice(0, 5).map((c) => (
                            <span key={c.hex} title={c.name} className="w-4 h-4 rounded-full border border-vous-border inline-block" style={{ background: c.hex }} />
                          ))}
                          {product.colors.length > 5 && <span className="text-[10px] text-vous-text-secondary">+{product.colors.length - 5}</span>}
                        </div>
                      </div>
                    )}
                    {product.sizes.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Tallas</span>
                        <div className="flex items-center gap-1 flex-wrap mt-0.5">
                          {product.sizes.slice(0, 6).map((s) => (
                            <span key={s} className="px-1 py-0.5 text-[9px] font-nav uppercase border border-vous-border text-vous-text-secondary">{s}</span>
                          ))}
                          {product.sizes.length > 6 && <span className="text-[10px] text-vous-text-secondary">+{product.sizes.length - 6}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant={product.isActive ? "active" : "inactive"}>{product.isActive ? "Activo" : "Inactivo"}</Badge>
                    {product.isFeatured && <span className="flex items-center gap-0.5 text-[10px] font-nav text-amber-600 uppercase"><Star size={10} fill="currentColor" />Destacado</span>}
                    {product.isBestseller && <span className="text-[10px] font-nav text-green-600 uppercase">Bestseller</span>}
                    {product.isPreorder && <span className="text-[10px] font-nav text-blue-600 uppercase">Preventa</span>}
                    {product.isSpecialCollection && <span className="text-[10px] font-nav text-purple-600 uppercase">Col. Especial</span>}
                   </div>
                   {(product.colors.length > 0 || product.sizes.length > 0) && (
                     <div className="mt-2">
                       <button
                         type="button"
                         onClick={() => toggleExpand(product.id)}
                         className="flex items-center gap-1 text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary hover:text-vous-text transition-colors"
                       >
                         {expandedIds.has(product.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                         {expandedIds.has(product.id) ? "Ocultar variantes" : `Ver variantes (${(variantsMap[product.id] ?? []).length || "?"})`}
                       </button>
                       {expandedIds.has(product.id) && (
                         <div className="mt-2 space-y-2">
                           {variantsLoadingMap[product.id] ? (
                             <p className="text-[11px] text-vous-text-secondary">Cargando variantes...</p>
                           ) : (variantsMap[product.id] ?? []).length === 0 ? (
                             <p className="text-[11px] text-vous-text-secondary">Sin variantes guardadas.</p>
                           ) : (
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                               {(variantsMap[product.id] ?? []).map((v) => (
                                 <button
                                   key={v.id}
                                   type="button"
                                   onClick={() => { setPreview(product); setPreviewImg(v.images?.[0] ?? product.images[0] ?? null); }}
                                   className="text-left border border-vous-border bg-white/90 p-2 rounded hover:border-vous-text/30 transition-colors"
                                 >
                                   <div className="aspect-square bg-vous-surface rounded overflow-hidden mb-1.5 relative">
                                     {v.images?.[0] ? (
                                       <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                                     ) : product.images[0] ? (
                                       <img src={product.images[0]} alt="" className="w-full h-full object-cover opacity-60" />
                                     ) : (
                                       <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-vous-text-secondary" /></div>
                                     )}
                                     {!v.isActive && (
                                       <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                         <span className="text-white text-[9px] font-nav uppercase tracking-wider">Inactiva</span>
                                       </span>
                                     )}
                                   </div>
                                   <div className="space-y-0.5">
                                     <div className="flex items-center gap-1">
                                       {v.color && (
                                         <>
                                           <span className="w-2.5 h-2.5 rounded-full border border-vous-border shrink-0" style={{ background: v.colorHex ?? "#888" }} />
                                           <span className="text-[10px] font-nav uppercase text-vous-text">{v.color}</span>
                                         </>
                                       )}
                                     </div>
                                     {v.size && <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Talla {v.size}</span>}
                                     <div className="flex items-center gap-1 pt-0.5">
                                       <span className={`text-[11px] font-nav font-semibold ${v.stock <= 0 ? "text-red-600" : v.stock <= 3 ? "text-amber-600" : "text-vous-text"}`}>
                                         {v.stock} u.
                                       </span>
                                       {v.sku && <span className="text-[9px] text-vous-text-secondary font-mono ml-auto">{v.sku}</span>}
                                     </div>
                                   </div>
                                 </button>
                               ))}
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   )}
                   <div className="flex items-center gap-1 flex-wrap mt-3 pt-3 border-t border-white/30">
                     <Button variant="ghost" size="icon-sm" onClick={() => { setPreview(product); setPreviewImg(product.images[0] ?? null); }} title="Ver"><Maximize2 size={13} /></Button>
                     <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(product.id, product.isActive)} title={product.isActive ? "Desactivar" : "Activar"}>{product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}</Button>
                     <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(product)}><Pencil size={14} /></Button>
                     <Button variant="ghost" size="icon-sm" className="text-red-600 hover:text-red-700" onClick={() => setConfirmDelete(product.id)}><Trash2 size={14} /></Button>
                     {(product.colors.length > 0 || product.sizes.length > 0) && <Button variant="ghost" size="icon-sm" onClick={() => setVariantProduct(product)}><Package size={14} /></Button>}
                     <Button variant="ghost" size="icon-sm" onClick={() => setFlagsProduct(product)}><Settings2 size={14} /></Button>
                   </div>
                 </div>
              ))}
            </div>

            {/* ── Desktop: table ──────────────────────────────────────── */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Img", "Producto", "Categoría", "Precio", "Variantes", "Stock", "Estado", ""].map((h) => <TableHead key={h}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product, idx) => (
                    <>
                    <TableRow key={product.id} draggable onDragStart={() => setDragIdx(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(idx)} className={dragIdx === idx ? "opacity-40" : ""}>
                      <TableCell className="w-14">
                        <div className="flex items-center gap-1">
                          <GripVertical size={14} className="text-vous-text-muted cursor-grab shrink-0" />
                          {product.images[0] ? (
                            <button onClick={() => { setPreview(product); setPreviewImg(product.images[0]); }} className="w-11 h-11 border border-vous-border overflow-hidden hover:opacity-80 transition-opacity bg-white/90">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            </button>
                          ) : (
                            <div className="w-11 h-11 border border-vous-border bg-vous-surface flex items-center justify-center"><Package size={16} className="text-vous-text-secondary" /></div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-nav text-[13px] font-semibold text-vous-text">{product.name}</p>
                        <p className="text-[11px] text-vous-text-secondary font-sans">{product.slug}</p>
                        {product.badge && <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-nav uppercase tracking-wider bg-vous-text text-vous-bg">{product.badge}</span>}
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">{product.categoryName}</TableCell>
                      <TableCell>
                        <p className="text-[13px] font-nav font-semibold text-vous-text">Bs. {product.price.toLocaleString("es-BO")}{product.isDiscounted && product.discountPercentage ? <span className="ml-1.5 text-[10px] text-red-600">-{product.discountPercentage}%</span> : null}</p>
                        {product.wholesalePrice ? <p className="text-[11px] text-vous-text-secondary font-sans">Mayor: Bs. {product.wholesalePrice.toLocaleString("es-BO")}</p> : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {product.colors.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {product.colors.slice(0, 5).map((c) => (<span key={c.hex} title={c.name} className="w-4 h-4 rounded-full border border-vous-border inline-block" style={{ background: c.hex }} />))}
                              {product.colors.length > 5 && <span className="text-[10px] text-vous-text-secondary">+{product.colors.length - 5}</span>}
                            </div>
                          )}
                          {product.sizes.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {product.sizes.slice(0, 4).map((s) => (<span key={s} className="px-1 py-0.5 text-[9px] font-nav uppercase border border-vous-border text-vous-text-secondary">{s}</span>))}
                              {product.sizes.length > 4 && <span className="text-[10px] text-vous-text-secondary">+{product.sizes.length - 4}</span>}
                            </div>
                          )}
                          {product.colors.length === 0 && product.sizes.length === 0 && <span className="text-[11px] text-vous-text-secondary font-sans">—</span>}
                          {(product.colors.length > 0 || product.sizes.length > 0) && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(product.id)}
                              className="flex items-center gap-1 text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary hover:text-vous-text mt-1 transition-colors"
                            >
                              {expandedIds.has(product.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              {expandedIds.has(product.id) ? "Ocultar variantes" : "Ver variantes"}
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              defaultValue={product.stock}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (Number.isFinite(val) && val >= 0 && val !== product.stock) {
                                  void update(product.id, { stock: Math.floor(val) });
                                }
                              }}
                              className={`w-16 text-[12px] font-sans border border-vous-border bg-vous-surface px-1.5 py-0.5 text-vous-text ${product.stock <= 5 ? "text-red-600" : ""}`}
                              title="Ajustar stock general"
                            />
                            {product.stock <= 5 && <span className="text-[10px] font-nav text-red-600 uppercase">CRÍTICO</span>}
                          </div>
                          {product.wholesaleOnly && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] font-nav text-vous-gold uppercase">Mayorista:</span>
                              <input type="number" min={0} defaultValue={product.wholesaleStock ?? 0} onBlur={(e) => { const val = Number(e.target.value); if (Number.isFinite(val) && val >= 0) { void adjustWholesaleStock(product.id, Math.floor(val)); } }} className="w-16 text-[11px] font-sans border border-vous-border bg-vous-surface px-1 py-0.5 text-vous-text" title="Ajustar stock mayorista" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={product.isActive ? "active" : "inactive"}>{product.isActive ? "Activo" : "Inactivo"}</Badge>
                          {product.isFeatured && <span className="flex items-center gap-0.5 text-[10px] font-nav text-amber-600 uppercase"><Star size={10} fill="currentColor" />Destacado</span>}
                          {product.isBestseller && <span className="text-[10px] font-nav text-green-600 uppercase">Más Vendido</span>}
                          {product.isPreorder && <span className="text-[10px] font-nav text-blue-600 uppercase">Preventa</span>}
                          {product.isSpecialCollection && <span className="text-[10px] font-nav text-purple-600 uppercase">Col. Especial</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon-sm" onClick={() => { setPreview(product); setPreviewImg(product.images[0] ?? null); }} title="Ver detalle"><Maximize2 size={13} /></Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(product.id, product.isActive)} title={product.isActive ? "Desactivar" : "Activar"}>{product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}</Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(product)}><Pencil size={14} /></Button>
                          <Button variant="ghost" size="icon-sm" className="text-red-600 hover:text-red-700" title="Eliminar producto" onClick={() => setConfirmDelete(product.id)}><Trash2 size={14} /></Button>
                          {(product.colors.length > 0 || product.sizes.length > 0) && <Button variant="ghost" size="icon-sm" title="Gestionar variantes" onClick={() => setVariantProduct(product)}><Package size={14} /></Button>}
                          <Button variant="ghost" size="icon-sm" title="Configurar marcadores" onClick={() => setFlagsProduct(product)}><Settings2 size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Expanded variants row */}
                    {expandedIds.has(product.id) && (
                      <TableRow key={`${product.id}-variants`} className="bg-vous-surface/50">
                        <TableCell colSpan={8} className="py-3">
                          {variantsLoadingMap[product.id] ? (
                            <p className="text-[11px] text-vous-text-secondary">Cargando variantes...</p>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
                                  Variantes de {product.name} ({(variantsMap[product.id] ?? []).length})
                                </p>
                                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setVariantProduct(product)}>
                                  <Pencil size={11} /> Editar variantes
                                </Button>
                              </div>
                              {(variantsMap[product.id] ?? []).length === 0 ? (
                                <p className="text-[11px] text-vous-text-secondary">Este producto no tiene variantes guardadas.</p>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                  {(variantsMap[product.id] ?? []).map((v) => (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => { setPreview(product); setPreviewImg(v.images?.[0] ?? product.images[0] ?? null); }}
                                      className="text-left border border-vous-border bg-white/90 p-2.5 rounded hover:border-vous-text/30 transition-colors group"
                                    >
                                      <div className="aspect-square bg-vous-surface rounded overflow-hidden mb-2 relative">
                                        {v.images?.[0] ? (
                                          <img src={v.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : product.images[0] ? (
                                          <img src={product.images[0]} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-vous-text-secondary" /></div>
                                        )}
                                        {!v.isActive && (
                                          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white text-[9px] font-nav uppercase tracking-wider">Inactiva</span>
                                          </span>
                                        )}
                                      </div>
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1">
                                          {v.color && (
                                            <>
                                              <span className="w-2.5 h-2.5 rounded-full border border-vous-border shrink-0" style={{ background: v.colorHex ?? "#888" }} />
                                              <span className="text-[10px] font-nav uppercase text-vous-text">{v.color}</span>
                                            </>
                                          )}
                                        </div>
                                        {v.size && <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Talla {v.size}</span>}
                                        <div className="flex items-center gap-1 pt-0.5">
                                          <span className={`text-[11px] font-nav font-semibold ${v.stock <= 0 ? "text-red-600" : v.stock <= 3 ? "text-amber-600" : "text-vous-text"}`}>
                                            {v.stock} u.
                                          </span>
                                          {v.sku && <span className="text-[9px] text-vous-text-secondary font-mono ml-auto">{v.sku}</span>}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <ProductFormDialog
        key={editing?.id ?? (dialogOpen ? "new" : "closed")}
        open={dialogOpen}
        product={editing}
        categories={categories}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
      <VariantDrawer product={variantProduct} onClose={() => setVariantProduct(null)} />
      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title="Eliminar producto"
        description="Esta acción eliminará el producto permanentemente del catálogo. No se puede deshacer."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />

      <ProductFlagsDialog
        open={!!flagsProduct}
        product={flagsProduct}
        onClose={() => setFlagsProduct(null)}
        onSave={setFlags}
        onApplyDiscount={applyDiscount}
      />

      <CategoryDiscountDialog
        open={categoryDiscountOpen}
        categories={categories}
        onClose={() => setCategoryDiscountOpen(false)}
        onApply={applyCatDiscount}
      />

      <Dialog open={!!preview} onOpenChange={(o) => { if (!o) { setPreview(null); setPreviewImg(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="font-nav text-[16px] tracking-widest uppercase text-vous-text">{preview.name}</DialogTitle>
                <p className="text-[11px] text-vous-text-secondary font-sans">{preview.slug} · {preview.categoryName}</p>
              </DialogHeader>

              {preview.images.length > 0 && (
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] bg-vous-surface rounded overflow-hidden">
                    <img src={previewImg ?? preview.images[0]} alt={preview.name} className="w-full h-full object-cover" />
                  </div>
                  {preview.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {preview.images.map((img, i) => (
                        <button key={i} onClick={() => setPreviewImg(img)}
                          className={`w-16 h-16 flex-shrink-0 border-2 overflow-hidden transition-colors ${
                            (previewImg ?? preview.images[0]) === img ? "border-vous-gold" : "border-vous-border"
                          }`}>
                          <img src={img} alt={`${preview.name} ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] font-sans">
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Precio</p>
                  <p className="text-[15px] font-nav font-semibold text-vous-text">Bs. {preview.price.toLocaleString("es-BO")}</p>
                  {preview.isDiscounted && preview.discountPercentage ? (
                    <p className="text-[11px] text-red-600">Descuento: {preview.discountPercentage}%</p>
                  ) : null}
                  {preview.wholesalePrice ? (
                    <p className="text-[11px] text-vous-text-secondary">Mayorista: Bs. {preview.wholesalePrice.toLocaleString("es-BO")}</p>
                  ) : null}
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Stock</p>
                  <p className={`text-[15px] font-nav font-semibold ${preview.stock <= 5 ? "text-red-600" : "text-vous-text"}`}>{preview.stock} unidades</p>
                </div>
                {preview.description && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Descripción</p>
                    <p className="text-vous-text-secondary leading-relaxed">{preview.description}</p>
                  </div>
                )}
                {preview.detail && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Detalle</p>
                    <p className="text-vous-text-secondary leading-relaxed">{preview.detail}</p>
                  </div>
                )}
                {preview.colors.length > 0 && (
                  <div>
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Colores</p>
                    <div className="flex flex-wrap gap-2">
                      {preview.colors.map((c) => (
                        <span key={c.hex} className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full border border-vous-border" style={{ background: c.hex }} />
                          <span className="text-vous-text-secondary">{c.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {preview.sizes.length > 0 && (
                  <div>
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Tallas</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.sizes.map((s) => (
                        <span key={s} className="px-2 py-1 text-[11px] font-nav uppercase border border-vous-border text-vous-text-secondary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {preview.materials.length > 0 && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Materiales</p>
                    <p className="text-vous-text-secondary">{preview.materials.join(", ")}</p>
                  </div>
                )}
                {preview.attributes && Object.keys(preview.attributes).length > 0 && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Atributos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                      {Object.entries(preview.attributes)
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <span key={k} className="text-[11px] font-sans">
                            <span className="text-vous-text-secondary capitalize">{k}:</span> {v}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                {preview.tags && preview.tags.length > 0 && (
                  <div className="col-span-2">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {preview.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden font-sans text-vous-text-secondary">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Estado</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={preview.isActive ? "active" : "inactive"}>{preview.isActive ? "Activo" : "Inactivo"}</Badge>
                    {preview.isFeatured && <span className="flex items-center gap-0.5 text-[10px] font-nav text-amber-600 uppercase"><Star size={10} fill="currentColor" />Destacado</span>}
                    {preview.isBestseller && <span className="text-[10px] font-nav text-green-600 uppercase">Más Vendido</span>}
                    {preview.isPreorder && <span className="text-[10px] font-nav text-blue-600 uppercase">Preventa</span>}
                    {preview.isSpecialCollection && <span className="text-[10px] font-nav text-purple-600 uppercase">Colección Especial</span>}
                    {preview.badge && <span className="px-1.5 py-0.5 text-[9px] font-nav uppercase tracking-wider bg-vous-text text-vous-bg">{preview.badge}</span>}
                  </div>
                </div>
                <div>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary mb-1">Creado</p>
                  <p className="text-vous-text-secondary">{new Date(preview.createdAt).toLocaleDateString("es-BO", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              </div>

              {/* Variants section in preview */}
              {previewVariants.length > 0 && (
                <div className="border-t border-white/40 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">Variantes ({previewVariants.length})</p>
                    <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => { setVariantProduct(preview); setPreview(null); setPreviewImg(null); }}>
                      <Pencil size={11} /> Gestionar variantes
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Img</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Talla</TableHead>
                          <TableHead className="w-20">Stock</TableHead>
                          <TableHead className="w-28">SKU</TableHead>
                          <TableHead className="w-16">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewVariants.map((v) => (
                          <TableRow key={v.id}>
                            <TableCell>
                              {v.images && v.images.length > 0 ? (
                                <div className="relative w-8 h-8 border border-vous-border rounded overflow-hidden">
                                  <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                                  {v.images.length > 1 && (
                                    <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[7px] px-0.5 rounded-tl">+{v.images.length - 1}</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-vous-text-secondary text-[10px]">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {v.color ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-nav uppercase">
                                  <span className="w-3 h-3 rounded-full border border-vous-border" style={{ background: v.colorHex ?? "#888" }} />
                                  {v.color}
                                </span>
                              ) : (
                                <span className="text-vous-text-secondary text-[11px]">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-[11px] font-nav uppercase">{v.size ?? "—"}</TableCell>
                            <TableCell>
                              <span className={`text-[11px] font-nav font-semibold ${v.stock <= 0 ? "text-red-600" : v.stock <= 5 ? "text-amber-600" : "text-vous-text"}`}>{v.stock}</span>
                            </TableCell>
                            <TableCell className="text-[10px] text-vous-text-secondary font-mono">{v.sku ?? "—"}</TableCell>
                            <TableCell>
                              <Badge variant={v.isActive ? "active" : "inactive"} className="text-[9px]">{v.isActive ? "Activa" : "Inactiva"}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-white/40">
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
