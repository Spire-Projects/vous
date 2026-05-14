const STATUS_STYLES: Record<string, string> = {
  ENVIADO: 'bg-vous-gold/10 text-vous-gold',
  PENDIENTE: 'bg-vous-gray-light/30 text-vous-gray',
}

interface OrderCardProps {
  id: string
  productName: string
  detail: string
  status: 'ENVIADO' | 'PENDIENTE'
  statusNote: string
  price: string
  bg: string
}

export function OrderCard({ id, productName, detail, status, statusNote, price, bg }: OrderCardProps) {
  return (
    <div className="border border-vous-gray-light/40 p-5 flex flex-col sm:flex-row gap-5">
      <div className={`w-20 h-24 shrink-0 bg-gradient-to-b ${bg}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray">{id}</p>
            <h3 className="font-serif text-base text-vous-soft-black mt-0.5">{productName}</h3>
            <p className="font-sans text-xs text-vous-gray mt-1">{detail}</p>
          </div>
          <span className={`shrink-0 font-nav text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 ${STATUS_STYLES[status] ?? 'bg-vous-gray-light/30 text-vous-gray'}`}>
            {status}
          </span>
        </div>
        <p className="font-sans text-xs text-vous-gray mt-3">{statusNote}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="font-serif text-base text-vous-soft-black">{price}</p>
          {status === 'ENVIADO' ? (
            <button className="font-nav text-[11px] tracking-[0.1em] uppercase border border-vous-gray-light px-4 py-2 text-vous-gray hover:border-vous-soft-black hover:text-vous-soft-black transition-colors">
              Rastrear
            </button>
          ) : (
            <span className="font-nav text-[11px] tracking-[0.1em] uppercase text-vous-gray">
              En Espera
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
