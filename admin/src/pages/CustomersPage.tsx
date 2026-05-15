import { useState } from "react";
import { Search, Users, UserCheck, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useCustomers } from "@/hooks";
import type { Customer, CustomerRole } from "@/domain/entities/user.entity";

// ── Tipos y mapas ─────────────────────────────────────────────────────────

type FilterTab = "all" | "active" | "inactive" | "wholesaler";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
  { label: "Mayoristas", value: "wholesaler" },
];

const roleVariantMap: Record<CustomerRole, BadgeProps["variant"]> = {
  customer: "outline",
  wholesaler: "gold",
};

const roleLabelMap: Record<CustomerRole, string> = {
  customer: "Cliente",
  wholesaler: "Mayorista",
};

function formatDate(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }
  return "—";
}

// ── Componente ─────────────────────────────────────────────────────────────

export function CustomersPage() {
  const { customers, loading, error, toggleActive } = useCustomers();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "active" && c.isActive) ||
      (activeTab === "inactive" && !c.isActive) ||
      (activeTab === "wholesaler" && c.role === "wholesaler");
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q);
    return matchTab && matchSearch;
  });

  const totalActive = customers.filter((c) => c.isActive).length;
  const totalWholesale = customers.filter((c) => c.role === "wholesaler").length;

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Base de clientes registrados en la plataforma."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Clientes"
          value={loading ? "—" : String(customers.length)}
          icon={<Users size={24} strokeWidth={1} />}
        />
        <StatCard
          label="Clientes Activos"
          value={loading ? "—" : String(totalActive)}
          icon={<UserCheck size={24} strokeWidth={1} />}
        />
        <StatCard
          label="Mayoristas"
          value={loading ? "—" : String(totalWholesale)}
          isPositive
        />
      </div>

      {/* Table card */}
      <div className="bg-vous-white border border-vous-border">
        {/* Toolbar */}
        <div className="p-4 border-b border-vous-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
            <Input
              placeholder="Buscar por nombre, correo o teléfono…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={activeTab === tab.value ? "default" : "outline"}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm text-red-600 font-nav">{error}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Cliente", "Teléfono", "Tipo", "Estado", "Registro", "Acciones"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  {/* Cliente */}
                  <TableCell>
                    <p className="text-[13px] font-sans text-vous-black font-medium">{customer.name}</p>
                    <p className="text-[11px] text-vous-gray">{customer.email}</p>
                  </TableCell>

                  {/* Teléfono */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {customer.phone ?? "—"}
                  </TableCell>

                  {/* Tipo */}
                  <TableCell>
                    <Badge variant={roleVariantMap[customer.role]}>
                      {roleLabelMap[customer.role]}
                    </Badge>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Badge variant={customer.isActive ? "active" : "inactive"}>
                      {customer.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  {/* Fecha registro */}
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {formatDate(customer.createdAt)}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        title="Ver detalle"
                        onClick={() => setSelected(customer)}
                        className="text-vous-gray hover:text-vous-black transition-colors"
                      >
                        <Eye size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        title={customer.isActive ? "Desactivar cuenta" : "Activar cuenta"}
                        onClick={() => void toggleActive(customer.uid, customer.isActive)}
                        className={`transition-colors ${customer.isActive ? "text-green-600 hover:text-red-500" : "text-vous-gray hover:text-green-600"}`}
                      >
                        {customer.isActive
                          ? <ToggleRight size={18} strokeWidth={1.5} />
                          : <ToggleLeft size={18} strokeWidth={1.5} />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-vous-gray text-sm font-nav">
                    {search ? "No se encontraron clientes con ese filtro." : "No hay clientes registrados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Footer count */}
        {!loading && !error && (
          <div className="px-4 py-3 border-t border-vous-border">
            <p className="text-[11px] text-vous-gray font-nav">
              Mostrando {filtered.length} de {customers.length} clientes
            </p>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.email}</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Teléfono</p>
                  <p className="font-sans text-vous-black">{selected.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Tipo de Cuenta</p>
                  <Badge variant={roleVariantMap[selected.role]}>{roleLabelMap[selected.role]}</Badge>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Estado</p>
                  <Badge variant={selected.isActive ? "active" : "inactive"}>
                    {selected.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">Registro</p>
                  <p className="font-sans text-vous-black">{formatDate(selected.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-gray mb-0.5">UID Firebase</p>
                  <p className="font-mono text-[11px] text-vous-gray break-all">{selected.uid}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-vous-border flex justify-end gap-2">
                <Button
                  size="sm"
                  variant={selected.isActive ? "outline" : "gold"}
                  onClick={() => {
                    void toggleActive(selected.uid, selected.isActive);
                    setSelected((prev) => prev ? { ...prev, isActive: !prev.isActive } : null);
                  }}
                >
                  {selected.isActive ? (
                    <><ToggleLeft size={14} /> Desactivar cuenta</>
                  ) : (
                    <><ToggleRight size={14} /> Activar cuenta</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
