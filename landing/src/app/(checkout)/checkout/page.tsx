"use client";

import { useState, useRef } from "react";
import { Shield, Upload, CheckCircle, QrCode, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import { createOrder } from "@/application/use-cases/order/create-order";
import { uploadPaymentProof } from "@/application/use-cases/order/upload-payment-proof";
import { uploadFileToCloudinary } from "@/utils/cloudinary-upload";
import type { ShippingInfo, CreateOrderInput } from "@/domain/entities/order.entity";

// ── Form state ───────────────────────────────────────────────────────────────

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
}

// ── Step enum ────────────────────────────────────────────────────────────────

type Step = "form" | "payment" | "success";

// ── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { config: paymentConfig, loading: loadingQR } = usePaymentConfig();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<ShippingForm>({
    fullName: userProfile?.name ?? "",
    email: user?.email ?? "",
    phone: userProfile?.phone ?? "",
    department: userProfile?.departamento ?? "",
    city: "",
    address: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Order created in step 1 → used in step 2
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  // Comprobante upload
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Step 1: validate + create order ────────────────────────────────────────

  function validateForm(): string | null {
    if (!form.fullName.trim()) return "El nombre completo es requerido.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Ingresa un correo electrónico válido.";
    if (!form.phone.trim()) return "El número de celular es requerido.";
    if (!form.department.trim()) return "El departamento es requerido.";
    if (!form.city.trim()) return "La ciudad es requerida.";
    if (!form.address.trim()) return "La dirección es requerida.";
    if (items.length === 0) return "Tu carrito está vacío.";
    return null;
  }

  async function handleProceedToPayment() {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);

    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    setCreatingOrder(true);
    try {
      const shippingInfo: ShippingInfo = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        department: form.department.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        shippingType: "national",
      };

      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: null as null,
        productName: item.name,
        variantDescription:
          [item.size, item.color].filter(Boolean).join(" / ") || undefined,
        imageUrl: item.image,
        unitPrice: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        isWholesalePrice: false,
      }));

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

      const input: CreateOrderInput = {
        customerId: user.uid,
        customerSnapshot: {
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          department: form.department.trim(),
        },
        items: orderItems,
        subtotal,
        total: subtotal,
        paymentMethod: "qr",
        shippingInfo,
        isWholesale: false,
      };

      const order = await createOrder(firestoreOrderRepository, input);
      setCreatedOrderId(order.id);
      setOrderNumber(order.orderNumber);
      setStep("payment");
    } catch {
      setFormError("Ocurrió un error al crear el pedido. Intenta nuevamente.");
    } finally {
      setCreatingOrder(false);
    }
  }

  // ── Step 2: upload comprobante ──────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setProofFile(file);
    setProofError(null);
  }

  async function handleSubmitProof() {
    if (!proofFile) {
      setProofError("Debes subir el comprobante de pago.");
      return;
    }
    if (!createdOrderId) return;

    setUploading(true);
    setProofError(null);
    try {
      const url = await uploadFileToCloudinary(proofFile, "vous/comprobantes");
      await uploadPaymentProof(firestoreOrderRepository, createdOrderId, url);
      clearCart();
      setStep("success");
    } catch (e) {
      setProofError(e instanceof Error ? e.message : "Error al subir el comprobante.");
    } finally {
      setUploading(false);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function field(key: keyof ShippingForm) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value })),
    };
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // ── Render: success ──────────────────────────────────────────────────────────

  if (step === "success") {
    return (
      <div className="bg-vous-warm-white min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <CheckCircle size={48} className="text-green-600 mb-4" />
        <h1 className="font-serif text-3xl text-vous-soft-black mb-3">
          ¡Pedido recibido!
        </h1>
        <p className="font-sans text-sm text-vous-gray max-w-sm mb-2">
          Tu pedido <strong>{orderNumber}</strong> fue registrado con éxito. Estamos verificando
          tu pago y te notificaremos cuando sea confirmado.
        </p>
        <p className="font-sans text-xs text-vous-gray max-w-sm mb-8">
          Si tienes dudas, escríbenos por WhatsApp.
        </p>
        <Link
          href="/"
          className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white px-8 py-3 hover:bg-vous-gray-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  // ── Render: checkout ─────────────────────────────────────────────────────────

  return (
    <div className="bg-vous-warm-white min-h-screen">
      {/* Header */}
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
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* ── Step 1: Shipping form ─────────────────────────────────── */}
            {step === "form" && (
              <section>
                <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-vous-gold mb-6">
                  Información de Envío
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      { key: "fullName", label: "Nombre Completo", type: "text", span: true },
                      { key: "email", label: "Correo Electrónico", type: "email", span: false },
                      { key: "phone", label: "Celular", type: "tel", span: false },
                      { key: "department", label: "Departamento", type: "text", span: false },
                      { key: "city", label: "Ciudad", type: "text", span: false },
                      { key: "address", label: "Dirección de entrega", type: "text", span: true },
                    ] as const
                  ).map(({ key, label, type, span }) => (
                    <div key={key} className={span ? "md:col-span-2" : ""}>
                      <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        className="w-full border border-vous-gray-light bg-transparent font-sans text-sm text-vous-soft-black px-3 py-2.5 outline-none focus:border-vous-gold transition-colors"
                        {...field(key as keyof ShippingForm)}
                      />
                    </div>
                  ))}
                </div>

                {formError && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 font-sans text-sm">
                    <AlertCircle size={14} />
                    {formError}
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  disabled={creatingOrder}
                  className="mt-6 w-full font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white py-4 hover:bg-vous-gray-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creatingOrder ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Procesando…
                    </>
                  ) : (
                    "Continuar al pago"
                  )}
                </button>
              </section>
            )}

            {/* ── Step 2: QR + comprobante ──────────────────────────────── */}
            {step === "payment" && (
              <section>
                <div className="mb-6 p-3 bg-vous-cream border border-vous-border font-sans text-sm text-vous-soft-black">
                  Pedido <strong>{orderNumber}</strong> creado. Ahora realiza la transferencia y sube tu comprobante.
                </div>

                <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-vous-gold mb-6">
                  Pago mediante QR — E-Transfer
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* QR image */}
                  <div className="shrink-0">
                    {loadingQR ? (
                      <div className="w-44 h-44 bg-vous-cream border border-vous-border flex items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-vous-gray" />
                      </div>
                    ) : paymentConfig?.qrImageUrl ? (
                      <img
                        src={paymentConfig.qrImageUrl}
                        alt="Código QR para pago"
                        className="w-44 h-44 object-contain border border-vous-border"
                      />
                    ) : (
                      <div className="w-44 h-44 bg-vous-cream border border-vous-border flex flex-col items-center justify-center gap-2 text-vous-gray">
                        <QrCode size={32} strokeWidth={1} />
                        <span className="font-sans text-xs text-center px-2">
                          QR no disponible
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Instructions + upload */}
                  <div className="space-y-4 flex-1">
                    <p className="font-sans text-sm text-vous-gray leading-relaxed">
                      Escanea el código QR desde tu aplicación bancaria y realiza la transferencia
                      por el monto total. Una vez completado, adjunta tu comprobante de pago.
                    </p>

                    <div className="font-sans text-sm text-vous-soft-black font-medium">
                      Total a transferir:{" "}
                      <span className="font-serif text-lg">
                        Bs. {subtotal.toLocaleString("es-BO")}
                      </span>
                    </div>

                    {/* File upload area */}
                    <div
                      className="border-2 border-dashed border-vous-gray-light hover:border-vous-gold transition-colors cursor-pointer p-6 text-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {proofFile ? (
                        <div className="flex items-center justify-center gap-2 text-vous-gold">
                          <CheckCircle size={16} />
                          <span className="font-sans text-sm truncate max-w-[220px]">
                            {proofFile.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload size={18} className="mx-auto text-vous-gray mb-2" />
                          <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray">
                            Subir comprobante de pago
                          </p>
                          <p className="font-sans text-xs text-vous-gray-light mt-1">
                            JPG, PNG o PDF (máx. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />

                    {proofError && (
                      <div className="flex items-center gap-2 text-red-600 font-sans text-sm">
                        <AlertCircle size={14} />
                        {proofError}
                      </div>
                    )}

                    <button
                      onClick={handleSubmitProof}
                      disabled={uploading || !proofFile}
                      className="w-full font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white py-4 hover:bg-vous-gray-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Subiendo comprobante…
                        </>
                      ) : (
                        "Confirmar pago y finalizar pedido"
                      )}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right column: order summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-vous-cream p-6 sticky top-24">
              <h2 className="font-serif text-xl text-vous-soft-black mb-6">
                Resumen del Pedido
              </h2>

              {items.length === 0 ? (
                <p className="font-sans text-sm text-vous-gray">
                  Tu carrito está vacío.{" "}
                  <Link href="/catalogo" className="underline">
                    Ver catálogo
                  </Link>
                </p>
              ) : (
                <>
                  <div className="space-y-5 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-20 object-cover shrink-0 border border-vous-gray-light/40"
                          />
                        ) : (
                          <div className="w-16 h-20 shrink-0 bg-vous-soft-black/10" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm text-vous-soft-black leading-snug truncate">
                            {item.name}
                          </h3>
                          {(item.size || item.color) && (
                            <p className="font-sans text-xs text-vous-gray mt-0.5">
                              {[item.size, item.color].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <p className="font-sans text-xs text-vous-gray mt-0.5">
                            ×{item.quantity}
                          </p>
                          <p className="font-sans text-sm text-vous-soft-black font-medium mt-1">
                            Bs. {(item.price * item.quantity).toLocaleString("es-BO")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-vous-gray-light/40 pt-4 space-y-2 font-sans text-sm">
                    <div className="flex justify-between text-vous-gray">
                      <span>Subtotal</span>
                      <span>Bs. {subtotal.toLocaleString("es-BO")}</span>
                    </div>
                    <div className="flex justify-between text-vous-gold font-medium">
                      <span>Envío</span>
                      <span>A coordinar</span>
                    </div>
                    <div className="flex justify-between text-vous-soft-black font-medium border-t border-vous-gray-light/40 pt-2">
                      <span className="font-nav tracking-[0.1em] uppercase text-sm">Total</span>
                      <span className="font-serif text-lg">
                        Bs. {subtotal.toLocaleString("es-BO")}
                      </span>
                    </div>
                  </div>
                </>
              )}

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

