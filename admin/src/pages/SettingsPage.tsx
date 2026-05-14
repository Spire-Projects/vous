import { useState } from "react";
import { Plus, Edit2, Trash2, QrCode, Save, Eye } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";

const BANNERS = [
  { id: 1, title: "Colección Urban Luxury 2024", active: true },
  { id: 2, title: "Próximamente: Editorial Verano", active: false },
];

const FAQ_ITEMS = [
  { id: 1, question: "¿Cuáles son los tiempos de envío internacional?", answer: "Nuestros envíos internacionales suelen tardar entre 7 y 12 días hábiles dependiendo de la zona de destino." },
  { id: 2, question: "Política de Devoluciones Editorial", answer: "" },
];

const USERS = [
  { id: 1, initials: "MA", name: "Maria Alvarez", role: "Editora de Contenidos" },
  { id: 2, initials: "JR", name: "Julian Rivas", role: "Gestor de Stock" },
  { id: 3, initials: "SR", name: "Sofia Rojas", role: "Finanzas" },
];

export function SettingsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="p-8">
      <PageHeader
        title="Configuración del Sistema"
        subtitle="Gestiona la identidad visual y operativa de VOUS."
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A] text-[12px] font-['Montserrat'] uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-colors">
              <Eye size={14} strokeWidth={1.5} />
              Vista Previa
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#1A1A1A] text-[12px] font-['Montserrat'] uppercase tracking-wider hover:bg-[#BF8F54] transition-colors">
              <Save size={14} strokeWidth={1.5} />
              Guardar Cambios
            </button>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Banners */}
        <section className="bg-white border border-[#E8E5E1] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A]">Banners de Landing</h2>
            <button className="flex items-center gap-1.5 text-[11px] font-['Montserrat'] uppercase tracking-wider text-[#C9A84C] hover:underline">
              <Plus size={12} strokeWidth={2} /> Añadir Nuevo Banner
            </button>
          </div>
          <div className="space-y-3">
            {BANNERS.map((banner) => (
              <div key={banner.id} className="flex items-center justify-between p-4 border border-[#E8E5E1] bg-[#FAFAF9]">
                <div>
                  <p className="text-[13px] font-['Montserrat'] font-semibold text-[#1A1A1A]">{banner.title}</p>
                  <span className={`text-[10px] font-['Montserrat'] uppercase tracking-wider mt-1 inline-block ${banner.active ? "text-green-600" : "text-[#9E9E9E]"}`}>
                    {banner.active ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors"><Edit2 size={14} strokeWidth={1.5} /></button>
                  <button className="p-1.5 text-[#9E9E9E] hover:text-red-500 transition-colors"><Trash2 size={14} strokeWidth={1.5} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white border border-[#E8E5E1] p-6">
          <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A] mb-5">Gestión de FAQ</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <div key={item.id} className="border border-[#E8E5E1]">
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-[13px] font-['Inter'] text-[#1A1A1A]">{item.question}</span>
                  <span className="text-[#9E9E9E] text-lg">{openFaq === item.id ? "−" : "+"}</span>
                </button>
                {openFaq === item.id && item.answer && (
                  <div className="px-4 pb-3">
                    <p className="text-sm font-['Inter'] text-[#9E9E9E]">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-[11px] font-['Montserrat'] uppercase tracking-wider text-[#C9A84C] hover:underline">
            <Plus size={12} strokeWidth={2} /> Agregar Nueva Pregunta Frecuente
          </button>
        </section>

        {/* QR */}
        <section className="bg-white border border-[#E8E5E1] p-6">
          <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A] mb-5">Métodos de Pago (QR)</h2>
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-[#E8E5E1] flex flex-col items-center justify-center gap-2 text-[#9E9E9E] cursor-pointer hover:border-[#C9A84C] transition-colors">
              <QrCode size={28} strokeWidth={1} />
              <span className="text-[10px] font-['Montserrat'] uppercase tracking-wider text-center">Subir imagen QR</span>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#9E9E9E] mb-1">Nombre del Método</label>
              <input
                type="text"
                defaultValue="Transferencia Directa"
                className="w-full max-w-xs border border-[#E8E5E1] px-3 py-2 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </section>

        {/* Perfiles */}
        <section className="bg-white border border-[#E8E5E1] p-6">
          <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A] mb-5">Perfiles de Usuario</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {USERS.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-4 border border-[#E8E5E1]">
                <div className="w-9 h-9 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-xs font-['Montserrat'] font-bold flex-shrink-0">
                  {u.initials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[13px] font-['Inter'] font-medium text-[#1A1A1A] truncate">{u.name}</p>
                  <p className="text-[11px] text-[#9E9E9E] truncate">{u.role}</p>
                </div>
                <button className="ml-auto text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#C9A84C] hover:underline flex-shrink-0">
                  Editar
                </button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-[11px] font-['Montserrat'] uppercase tracking-wider text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors">
            Ver Todos los Usuarios →
          </button>
        </section>
      </div>
    </div>
  );
}
