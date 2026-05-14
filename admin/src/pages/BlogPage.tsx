import { PageHeader } from "../components/ui/PageHeader";

export function BlogPage() {
  return (
    <div className="p-8">
      <PageHeader title="Blog / Revista" subtitle="Publicaciones editoriales de la marca VOUS." />
      <div className="bg-white border border-[#E8E5E1] p-12 flex items-center justify-center">
        <p className="text-[#9E9E9E] font-['Montserrat'] text-sm uppercase tracking-wider">Módulo en desarrollo</p>
      </div>
    </div>
  );
}
