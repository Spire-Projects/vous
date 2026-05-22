import { TrendingUp, Package } from "lucide-react";
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
      <div className="py-12 text-center text-vous-gray font-sans text-sm">
        No hay productos vendidos en este período
      </div>
    );
  }

  return (
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
                    className="w-8 h-8 object-cover border border-vous-border"
                  />
                ) : (
                  <div className="w-8 h-8 bg-vous-gray-light/30 flex items-center justify-center">
                    <Package size={12} className="text-vous-gray" />
                  </div>
                )}
                <span className="font-sans text-sm text-vous-black">
                  {p.productName}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right font-sans text-sm text-vous-gray">
              {p.unitsSold}
            </TableCell>
            <TableCell className="text-right font-nav text-sm text-vous-black">
              {formatCurrency(p.revenue)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
