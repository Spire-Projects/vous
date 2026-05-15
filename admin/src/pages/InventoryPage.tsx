import { useState } from "react";
import { Search, Plus, MoreVertical, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

type ProductPreview = {
  id: string;
  name: string;
  sku: string;
  category: string;
  variants: { size: string; color: string }[];
  stock: number;
  isActive: boolean;
  isCritical?: boolean;
};

const PRODUCTS: ProductPreview[] = [
  { id: "1", name: "Abrigo Noir Silk", sku: "VO-24-SH-001", category: "Exterior", variants: [{ size: "M", color: "Negro" }, { size: "L", color: "Negro" }], stock: 45, isActive: true },
  { id: "2", name: "Pantalón Avante-Garde", sku: "VO-24-TR-012", category: "Pantalones", variants: [{ size: "S", color: "Crema" }, { size: "M", color: "Crema" }], stock: 3, isActive: true, isCritical: true },
  { id: "3", name: "Tee Estructura V1", sku: "VO-24-TS-044", category: "Camisetas", variants: [{ size: "L", color: "Blanco" }, { size: "XL", color: "Blanco" }], stock: 112, isActive: false },
  { id: "4", name: "Vestido Editorial", sku: "VO-24-VE-007", category: "Vestidos", variants: [{ size: "S", color: "Negro" }], stock: 8, isActive: true, isCritical: true },
  { id: "5", name: "Reloj Urbano Límite", sku: "VO-24-AC-088", category: "Accesorios", variants: [{ size: "Única", color: "Oro" }], stock: 12, isActive: true },
];

export function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchLow = !filterLowStock || p.isCritical;
    return matchSearch && matchLow;
  });

  return (
    <div className="p-8">
      <PageHeader
        title="Inventario de Productos"
        subtitle="Gestione su catálogo con precisión editorial."
        action={
          <Button>
            <Plus size={14} strokeWidth={2} />
            Añadir Producto
          </Button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Productos" value="1,248" />
        <StatCard label="Categorías Activas" value="8" />
      </div>

      <div className="bg-vous-white border border-vous-border">
        <div className="p-4 border-b border-vous-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
            <Input
              placeholder="Buscar producto o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterLowStock((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 font-nav text-[11px] uppercase tracking-wide border transition-colors ${
              filterLowStock
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-vous-border text-vous-gray hover:border-vous-black"
            }`}
          >
            <AlertTriangle size={13} />
            Stock Crítico
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {["Producto", "Categoría", "Variantes", "Stock", "Estado", ""].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <p className="font-nav text-[13px] font-semibold text-vous-black">{product.name}</p>
                  <p className="text-[11px] text-vous-gray font-sans">SKU: {product.sku}</p>
                </TableCell>
                <TableCell className="text-[12px] font-sans text-vous-gray">{product.category}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.variants.map((v, i) => (
                      <span key={i} className="text-[10px] font-nav bg-vous-cream px-2 py-0.5 text-vous-gray">
                        {v.size} / {v.color}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-nav text-[13px] font-semibold ${product.isCritical ? "text-red-600" : "text-vous-black"}`}>
                    {product.stock}
                  </span>
                  {product.isCritical && (
                    <span className="ml-1.5 text-[10px] font-nav text-red-500 uppercase">CRÍTICO</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "active" : "inactive"}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button className="text-vous-gray hover:text-vous-black transition-colors">
                    <MoreVertical size={16} strokeWidth={1.5} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="px-4 py-3 border-t border-vous-border flex items-center justify-between">
          <p className="text-[11px] text-vous-gray font-nav">
            Mostrando {filtered.length} de 1,248 productos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 text-[12px] font-nav border ${p === 1 ? "bg-vous-black text-vous-white border-vous-black" : "border-vous-border text-vous-gray hover:border-vous-black"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
