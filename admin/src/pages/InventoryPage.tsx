import { useState } from "react";
import { Search, Plus, MoreVertical, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { getStockStatusClass } from "../utils";
import type { Product } from "../types";

const PRODUCTS: Product[] = [
  { id: "1", name: "Abrigo Noir Silk", sku: "VO-24-SH-001", category: "Exterior", variants: [{ size: "M", color: "Negro" }, { size: "L", color: "Negro" }], stock: 45, status: "ACTIVO" },
  { id: "2", name: "Pantalón Avante-Garde", sku: "VO-24-TR-012", category: "Pantalones", variants: [{ size: "S", color: "Crema" }, { size: "M", color: "Crema" }], stock: 3, status: "ACTIVO", isCritical: true },
  { id: "3", name: "Tee Estructura V1", sku: "VO-24-TS-044", category: "Camisetas", variants: [{ size: "L", color: "Blanco" }, { size: "XL", color: "Blanco" }], stock: 112, status: "INACTIVO" },
  { id: "4", name: "Vestido Editorial", sku: "VO-24-VE-007", category: "Vestidos", variants: [{ size: "S", color: "Negro" }], stock: 8, status: "ACTIVO", isCritical: true },
  { id: "5", name: "Reloj Urbano Límite", sku: "VO-24-AC-088", category: "Accesorios", variants: [{ size: "Única", color: "Oro" }], stock: 12, status: "ACTIVO" },
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
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-[12px] font-['Montserrat'] uppercase tracking-wider hover:bg-[#333] transition-colors">
            <Plus size={14} strokeWidth={2} />
            Añadir Producto
          </button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Productos" value="1,248" />
        <StatCard label="Stock Bajo" value="12 SKU" isPositive={false} />
        <StatCard label="Categorías Activas" value="8" />
        <StatCard label="Ventas (24h)" value="+42" isPositive change="+9% vs ayer" />
      </div>

      <div className="bg-white border border-[#E8E5E1]">
        <div className="p-4 border-b border-[#E8E5E1] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#E8E5E1] text-sm font-['Inter'] bg-[#FAFAF9] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`flex items-center gap-2 px-3 py-2 text-[11px] font-['Montserrat'] uppercase tracking-wider border transition-colors ${
              filterLowStock ? "bg-amber-50 border-amber-400 text-amber-700" : "border-[#E8E5E1] text-[#9E9E9E] hover:border-[#1A1A1A]"
            }`}
          >
            <AlertTriangle size={12} />
            Stock Bajo
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E5E1]">
              {["Producto", "Categoría", "Variantes", "Stock", "Estado", ""].map((h) => (
                <th key={h} className="text-left text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#9E9E9E] px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-[#F2F1F0] hover:bg-[#FAFAF9] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-['Montserrat'] text-[13px] font-semibold text-[#1A1A1A]">{product.name}</p>
                  <p className="text-[11px] text-[#9E9E9E] font-['Inter']">SKU: {product.sku}</p>
                </td>
                <td className="px-4 py-3 text-[12px] font-['Inter'] text-[#9E9E9E]">{product.category}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.variants.map((v, i) => (
                      <span key={i} className="text-[10px] font-['Montserrat'] bg-[#F2F1F0] px-2 py-0.5 text-[#9E9E9E]">
                        {v.size} / {v.color}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-['Montserrat'] text-[13px] font-semibold ${product.isCritical ? "text-red-600" : "text-[#1A1A1A]"}`}>
                    {product.stock}
                  </span>
                  {product.isCritical && (
                    <span className="ml-1.5 text-[10px] font-['Montserrat'] text-red-500 uppercase">CRÍTICO</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge label={product.status} className={getStockStatusClass(product.status)} />
                </td>
                <td className="px-4 py-3">
                  <button className="text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors">
                    <MoreVertical size={16} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-[#E8E5E1] flex items-center justify-between">
          <p className="text-[11px] text-[#9E9E9E] font-['Montserrat']">
            Mostrando {filtered.length} de 1,248 productos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 text-[12px] font-['Montserrat'] border ${p === 1 ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "border-[#E8E5E1] text-[#9E9E9E] hover:border-[#1A1A1A]"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
