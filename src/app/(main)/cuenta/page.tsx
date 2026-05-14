'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, CheckCircle } from 'lucide-react'
import { AccountSidebar } from '@/components/cuenta/AccountSidebar'
import { OrderCard } from '@/components/cuenta/OrderCard'

type TabId = 'perfil' | 'pedidos' | 'mayorista' | 'direcciones'

function TabPerfil() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-vous-soft-black mb-1">Datos Personales</h2>
        <p className="font-sans text-sm text-vous-gray">
          Bienvenido de nuevo, Sebastian. Gestiona tus pedidos y preferencias.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Nombre', value: 'Sebastian Valderrama' },
          { label: 'Email', value: 's.valderrama@vous.com' },
          { label: 'Teléfono', value: '+57 300 456 7890' },
          { label: 'Nacimiento', value: '14 de Mayo, 1992' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1">{label}</p>
            <p className="font-sans text-sm text-vous-soft-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors">
          Editar Perfil
        </button>
        <div className="flex items-center gap-2 font-sans text-xs text-vous-gold border border-vous-gold/30 px-3 py-2">
          <Star size={12} />
          Programa de Exclusividad
        </div>
      </div>
    </div>
  )
}

function TabMayorista() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-vous-soft-black mb-1">Solicitud Mayorista</h2>
      </div>
      <div className="border border-vous-gray-light/40 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-nav text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-vous-gold/10 text-vous-gold">
            En Revisión
          </span>
          <p className="font-sans text-xs text-vous-gray">Actualizado hace 2 días</p>
        </div>
        <h3 className="font-serif text-lg text-vous-soft-black">Beneficios VIP Activados</h3>
        <ul className="space-y-2">
          {['Precios de Curaduría', 'Acceso Early-Release', 'Soporte Personalizado'].map((b) => (
            <li key={b} className="flex items-center gap-2 font-sans text-sm text-vous-gray">
              <CheckCircle size={14} className="text-vous-gold shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TabPedidos() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-vous-soft-black">Mis Pedidos</h2>
      <div className="space-y-4">
        <OrderCard
          id="Pedido #VOUS-9821"
          productName="Abrigo Estructurado Noir"
          detail="Talla L · Qty 1"
          status="ENVIADO"
          statusNote="Llega el 18 de Noviembre"
          price="Bs. 1.250"
          bg="from-[#1a1a18] to-[#0d0d0b]"
        />
        <OrderCard
          id="Pedido #VOUS-9810"
          productName="Vestido Seda Champagne"
          detail="Talla M · Qty 1"
          status="PENDIENTE"
          statusNote="Procesando pago"
          price="Bs. 980"
          bg="from-[#d4cfc6] to-[#b0a898]"
        />
      </div>
      <button className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray border-b border-vous-gray hover:text-vous-gold hover:border-vous-gold transition-colors pb-0.5">
        Ver Historial Completo
      </button>
    </div>
  )
}

function TabDirecciones() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-vous-soft-black">Direcciones</h2>
      <p className="font-sans text-sm text-vous-gray">No tienes direcciones guardadas.</p>
      <button className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors">
        Agregar Dirección
      </button>
    </div>
  )
}

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  perfil: <TabPerfil />,
  pedidos: <TabPedidos />,
  mayorista: <TabMayorista />,
  direcciones: <TabDirecciones />,
}

export default function CuentaPage() {
  const [tab, setTab] = useState<TabId>('perfil')

  const handleLogout = () => {
    // TODO: call signOut from auth context
    window.location.href = '/'
  }

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <AccountSidebar active={tab} onTab={(id) => setTab(id as TabId)} onLogout={handleLogout} />
          <main className="flex-1 min-w-0">
            {TAB_CONTENT[tab]}
          </main>
        </div>
      </div>
    </div>
  )
}
