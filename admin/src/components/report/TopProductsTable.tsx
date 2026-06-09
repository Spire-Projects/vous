import { Package } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { TopProduct } from "@/domain/entities/report.entity";
import { formatCurrency } from "@/utils";

interface TopProductsTableProps {
  products: TopProduct[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-vous-text-secondary font-sans text-sm">
        No hay productos vendidos en este período
      </div>
    );
  }

  return (
    <>
      <div className="block md:hidden divide-y divide-white/30">
        {products.map((p, idx) => (
          <div key={p.productId} className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-10 h-10 object-cover border border-vous-border shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-vous-gray-light/30 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-vous-text-secondary" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Producto</span>
                <p className="font-sans text-sm text-vous-text">{p.productName}</p>
              </div>
              <span className="font-nav text-[11px] text-vous-gold shrink-0">
                #{idx + 1}
              </span>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Unidades</span>
                <p className="font-sans text-sm text-vous-text-secondary">{p.unitsSold}</p>
              </div>
              <div>
                <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Ingresos</span>
                <p className="font-nav text-sm text-vous-text">{formatCurrency(p.revenue)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Unidades</TableHead>
              <TableHead className="text-right">Ingresos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p, idx) => (
              <TableRow key={p.productId}>
                <TableCell>
                  <span className="font-nav text-[11px] text-vous-gold">
                    {idx + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="w-8 h-8 object-cover border border-vous-border shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-vous-gray-light/30 flex items-center justify-center">
                        <Package size={12} className="text-vous-text-secondary" />
                      </div>
                    )}
                    <span className="font-sans text-sm text-vous-text">
                      {p.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-sans text-sm text-vous-text-secondary">
                  {p.unitsSold}
                </TableCell>
                <TableCell className="text-right font-nav text-sm text-vous-text">
                  {formatCurrency(p.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
