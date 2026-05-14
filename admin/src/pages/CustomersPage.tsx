import { PageHeader } from "../components/ui/PageHeader";

export function CustomersPage() {
  return (
    <div className="p-8">
      <PageHeader title="Gestión de Clientes" subtitle="Base de clientes registrados en la plataforma." />
      <div className="bg-white border border-[#E8E5E1] p-12 flex items-center justify-center">
        <p className="text-[#9E9E9E] font-['Montserrat'] text-sm uppercase tracking-wider">Módulo en desarrollo</p>
      </div>
    </div>
  );
}
