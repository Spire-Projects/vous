'use client'

import { useState } from 'react'
import { CheckCircle, MessageCircle } from 'lucide-react'

const DEPARTMENTS = [
  'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí',
  'Chuquisaca', 'Tarija', 'Beni', 'Pando',
]

interface FormState {
  nombre: string
  email: string
  telefono: string
  empresa: string
  departamento: string
}

export function WholesaleForm() {
  const [form, setForm] = useState<FormState>({
    nombre: '', email: '', telefono: '', empresa: '', departamento: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }))

  if (submitted) {
    return (
      <div className="bg-vous-cream p-10 text-center space-y-4">
        <CheckCircle size={32} className="mx-auto text-vous-gold" />
        <h3 className="font-serif text-xl text-vous-soft-black">Solicitud Recibida</h3>
        <p className="font-sans text-sm text-vous-gray">
          Nos pondremos en contacto contigo dentro de las próximas 48 horas hábiles.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-vous-cream p-6 md:p-10">
      <h3 className="font-serif text-xl text-vous-soft-black mb-6">Portal de Consultas</h3>
      <div className="space-y-4">
        {([
          { label: 'Nombre Completo', key: 'nombre', type: 'text' },
          { label: 'Correo Electrónico de la Empresa', key: 'email', type: 'email' },
          { label: 'Teléfono del Negocio', key: 'telefono', type: 'tel' },
          { label: 'Nombre de la Empresa', key: 'empresa', type: 'text' },
        ] as const).map(({ label, key, type }) => (
          <div key={key}>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full border border-vous-gray-light bg-transparent font-sans text-sm text-vous-soft-black px-3 py-2.5 outline-none focus:border-vous-gold transition-colors"
            />
          </div>
        ))}
        <div>
          <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
            Departamento de Interés
          </label>
          <select
            value={form.departamento}
            onChange={(e) => set('departamento', e.target.value)}
            className="w-full border border-vous-gray-light bg-vous-cream font-sans text-sm text-vous-soft-black px-3 py-2.5 outline-none focus:border-vous-gold transition-colors"
          >
            <option value="">Seleccionar departamento</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <button
          onClick={() => setSubmitted(true)}
          className="w-full font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white py-4 hover:bg-vous-gray-dark transition-colors mt-2"
        >
          Enviar Registro
        </button>
      </div>

      <a
        href="https://api.whatsapp.com/send?phone=59165359595&text=Hola%20Luana%2C%20estoy%20interesado%20en%20el%20programa%20mayorista%20de%20VOUS"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-center gap-2 font-nav text-[11px] font-semibold tracking-[0.12em] uppercase border border-[#25D366] text-[#25D366] py-3 hover:bg-[#25D366] hover:text-white transition-colors w-full"
      >
        <MessageCircle size={14} />
        Contactar Soporte por WhatsApp
      </a>
    </div>
  )
}
