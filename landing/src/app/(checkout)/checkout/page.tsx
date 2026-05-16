"use client";

import { useState } from "react";
import { Shield, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";

const ORDER_ITEMS = [
  {
    name: "Abrigo de Lana Tailored",
    detail: "Talle: M | Color: Carbono",
    price: "Bs. 450",
    bg: "from-[#3d3d38] to-[#1a1a18]",
  },
  {
    name: "Pantalón Palazzo Seda",
    detail: "Talle: S | Color: Crema",
    price: "Bs. 320",
    bg: "from-[#d4cfc6] to-[#b0a898]",
  },
];

export default function CheckoutPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="bg-vous-warm-white min-h-screen">
      {/* Header bar */}
      <div className="border-b border-vous-gray-light/40 py-4 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-[0.08em] text-vous-soft-black"
          >
            VOUS
          </Link>
          <div className="flex items-center gap-2 font-sans text-xs text-vous-gray">
            <Shield size={13} className="text-vous-gold" />
            Pago Seguro
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-vous-soft-black mb-12">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: form + QR */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Shipping */}
            <section>
              <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-vous-gold mb-6">
                Información de Envío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Nombre Completo",
                  "Correo Electrónico",
                  "Celular",
                  "Departamento / Provincia",
                ].map((label) => (
                  <div
                    key={label}
                    className={
                      label === "Nombre Completo" || label === "Correo Electrónico"
                        ? "md:col-span-1"
                        : ""
                    }
                  >
                    <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
                      {label}
                    </label>
                    <input
                      type={
                        label === "Correo Electrónico"
                          ? "email"
                          : label === "Celular"
                            ? "tel"
                            : "text"
                      }
                      className="w-full border border-vous-gray-light bg-transparent font-sans text-sm text-vous-soft-black px-3 py-2.5 outline-none focus:border-vous-gold transition-colors"
                      placeholder=""
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* QR Payment */}
            <section>
              <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-vous-gold mb-6">
                Método de Pago: QR E-Transfer
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* QR placeholder */}
                <div className="w-44 h-44 bg-vous-cream border border-vous-gray-light/60 flex items-center justify-center shrink-0">
                  <div className="w-36 h-36 grid grid-cols-3 gap-1 opacity-40">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${[0, 2, 4, 6, 8].includes(i) ? "bg-vous-soft-black" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <p className="font-sans text-sm text-vous-gray leading-relaxed">
                    Escanea el código QR desde tu aplicación bancaria para realizar la
                    transferencia. Una vez completado, adjunta el comprobante.
                  </p>
                  <label className="block">
                    <div className="border-2 border-dashed border-vous-gray-light hover:border-vous-gold transition-colors cursor-pointer p-6 text-center">
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-vous-gold">
                          <CheckCircle size={16} />
                          <span className="font-sans text-sm">{file.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={18} className="mx-auto text-vous-gray mb-2" />
                          <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray">
                            Subir comprobante de pago
                          </p>
                          <p className="font-sans text-xs text-vous-gray-light mt-1">
                            JPG, PNG o PDF (Max. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <button className="w-full font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white py-4 hover:bg-vous-gray-dark transition-colors">
                    Finalizar Pedido
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right: order summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-vous-cream p-6 sticky top-24">
              <h2 className="font-serif text-xl text-vous-soft-black mb-6">Resumen del Pedido</h2>
              <div className="space-y-5 mb-6">
                {ORDER_ITEMS.map(({ name, detail, price, bg }) => (
                  <div key={name} className="flex gap-3">
                    <div className={`w-16 h-20 shrink-0 bg-gradient-to-b ${bg}`} />
                    <div>
                      <h3 className="font-serif text-sm text-vous-soft-black leading-snug">
                        {name}
                      </h3>
                      <p className="font-sans text-xs text-vous-gray mt-0.5">{detail}</p>
                      <p className="font-sans text-sm text-vous-soft-black font-medium mt-1">
                        {price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-vous-gray-light/40 pt-4 space-y-2 font-sans text-sm">
                <div className="flex justify-between text-vous-gray">
                  <span>Subtotal</span>
                  <span>Bs. 770</span>
                </div>
                <div className="flex justify-between text-vous-gold font-medium">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between text-vous-soft-black font-medium border-t border-vous-gray-light/40 pt-2">
                  <span className="font-nav tracking-[0.1em] uppercase text-sm">Total</span>
                  <span className="font-serif text-lg">Bs. 770</span>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-2 font-sans text-[11px] text-vous-gray border-t border-vous-gray-light/40 pt-4">
                <Shield size={12} className="text-vous-gold shrink-0 mt-0.5" />
                Compra segura protegida por VOUS. Envíos asegurados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
