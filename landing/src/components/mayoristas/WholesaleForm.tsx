"use client";

import { useState, useRef } from "react";
import {
  CheckCircle,
  MessageCircle,
  Upload,
  X,
  AlertCircle,
  ChevronDown,
  FileText,
  ExternalLink,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary.client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWholesaleRules } from "@/hooks/useWholesaleRules";

// ── Constantes ─────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Santa Cruz",
  "Beni",
  "Tarija",
  "Cochabamba",
  "Oruro",
  "La Paz",
  "Potosí",
  "Chuquisaca",
  "Pando",
];

const HOW_FOUND_OPTIONS = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "tienda_fisica", label: "Tienda Física Cbba" },
  { value: "recomendacion", label: "Me lo recomendaron" },
];

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── Cloudinary upload ──────────────────────────────────────────────────────

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    const msg = errData?.error?.message ?? `Error ${res.status}`;
    throw new Error(`Error al subir "${file.name}": ${msg}`);
  }
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

// ── Componente ─────────────────────────────────────────────────────────────

interface FormState {
  nombre: string;
  carnet: string;
  telefono: string;
  departamento: string;
  comoNosConocio: string;
  direccion: string;
}

export function WholesaleForm() {
  const { rules, loading: rulesLoading } = useWholesaleRules();
  const [form, setForm] = useState<FormState>({
    nombre: "",
    carnet: "",
    telefono: "",
    departamento: "",
    comoNosConocio: "",
    direccion: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    setFileError("");
    const arr = Array.from(newFiles);
    const oversized = arr.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) {
      setFileError(
        `Archivos superan ${MAX_FILE_SIZE_MB} MB: ${oversized.map((f) => f.name).join(", ")}`
      );
      return;
    }
    setFiles((prev) => [...prev, ...arr].slice(0, MAX_FILES));
  }

  const isValid =
    form.nombre.trim() &&
    form.carnet.trim() &&
    form.telefono.trim() &&
    form.departamento &&
    form.comoNosConocio &&
    form.direccion.trim();

  async function handleSubmit() {
    if (!isValid || loading) return;
    setLoading(true);
    setError("");
    try {
      let fileUrls: string[] = [];
      if (files.length > 0) {
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
          throw new Error("La subida de imágenes no está configurada. Contacta al administrador.");
        }
        fileUrls = await Promise.all(files.map(uploadToCloudinary));
      }
      await addDoc(collection(getFirebaseDb(), "wholesaleRequests"), {
        contactName: form.nombre.trim(),
        carnetIdentidad: form.carnet.trim(),
        phone: form.telefono.trim(),
        department: form.departamento,
        howFound: form.comoNosConocio,
        distributionAddress: form.direccion.trim(),
        onlineStoreFiles: fileUrls,
        status: "pending",
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="bg-white p-10 text-center space-y-5">
        <CheckCircle size={36} className="mx-auto text-black" strokeWidth={1.5} />
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-black">Formulario Enviado</h3>
          <p className="font-sans text-sm text-black/50 leading-relaxed max-w-xs mx-auto">
            Gracias por registrarte. Recuerda sacar captura a tu pantalla y enviarla a tu asesora de
            ventas.
          </p>
        </div>
        <a
          href="mailto:gabriela.garcia.villalobos.dev@gmail.com"
          className="inline-block font-nav text-[10px] tracking-[0.2em] uppercase text-black border border-black/50 px-6 py-3 hover:bg-black hover:text-white transition-colors"
        >
          gabriela.garcia.villalobos.dev@gmail.com
        </a>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white p-6 md:p-10">
      {/* Header */}
      <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-1">
        Registro Oficial
      </p>
      <h3 className="font-serif text-xl text-black mb-4">Formulario Clientes Por Mayor VOUS</h3>
      <div className="space-y-2 mb-7 pb-7 border-b border-black/10">
        <p className="font-sans text-xs text-black/50 leading-relaxed">
          Somos una empresa de industria boliviana registrada en el{" "}
          <strong className="text-black font-medium">SENAPI</strong>. Para proteger nuestra marca y
          garantizar una correcta distribución, recopilamos los datos de todos nuestros
          distribuidores VOUS.
        </p>
        <p className="font-sans text-xs text-black/50 leading-relaxed">
          Como parte de nuestro compromiso, compartimos la ubicación y nombre de tu tienda con
          clientes de otros departamentos, para ayudarte a generar mayor visibilidad y ventas.
        </p>

        {/* Términos dinámicos desde admin */}
        <div className="mt-4 border border-black/10 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setTermsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-[#FAF8F5] hover:bg-black/5 transition-colors"
          >
            <span className="flex items-center gap-2 font-sans text-xs font-medium text-black">
              <FileText size={14} />
              {rulesLoading ? "Cargando términos..." : "Reglas y condiciones para distribuidores"}
            </span>
            <ChevronDown
              size={14}
              className={`text-black/50 transition-transform ${termsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {termsOpen && rules && (
            <div className="px-4 py-4 space-y-3">
              {rules.termsUrl && (
                <a
                  href={rules.termsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-black underline hover:text-black/70"
                >
                  <ExternalLink size={12} /> Ver documento completo de reglas
                </a>
              )}
              <div
                className="text-xs text-black/60 font-sans leading-relaxed [&_strong]:font-semibold [&_strong]:text-black [&_em]:italic [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
                dangerouslySetInnerHTML={{
                  __html: rules.termsContent || "<p>Reglas y condiciones de distribución VOUS.</p>",
                }}
              />
            </div>
          )}
        </div>

        <p className="font-sans text-xs leading-relaxed">
          <span className="text-black font-medium">
            Al enviar este formulario aceptas todas nuestras reglas y condiciones. No aceptamos
            reclamos en contra de nuestras reglas una vez enviado.
          </span>{" "}
          <span className="text-black/50">
            Recuerda tomar captura a tu pantalla y enviarla a la asesora de ventas.
          </span>
        </p>
      </div>

      <div className="space-y-5">
        {/* Nombre Completo */}
        <div className="space-y-1.5">
          <Label htmlFor="nombre">
            Nombre Completo <span className="text-red-500 not-uppercase">*</span>
          </Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Tu nombre completo"
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
          />
        </div>

        {/* Carnet de identidad */}
        <div className="space-y-1.5">
          <Label htmlFor="carnet">
            Número de Carnet de Identidad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="carnet"
            type="text"
            placeholder="Ej: 12345678"
            value={form.carnet}
            onChange={(e) => set("carnet", e.target.value)}
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-1.5">
          <Label htmlFor="telefono">
            Número de Celular <span className="text-red-500">*</span>
          </Label>
          <p className="font-sans text-[11px] text-black/50 -mt-0.5 mb-1">
            Corporativo o número de contacto directo con la asesora por mayor
          </p>
          <Input
            id="telefono"
            type="tel"
            placeholder="+591 7X XXX XXX"
            value={form.telefono}
            onChange={(e) => set("telefono", e.target.value)}
          />
        </div>

        {/* Departamento */}
        <div className="space-y-1.5">
          <Label>
            Departamento a Distribuir la Marca <span className="text-red-500">*</span>
          </Label>
          <Select value={form.departamento} onValueChange={(v: string) => set("departamento", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ¿Cómo nos conoció? */}
        <div className="space-y-2">
          <Label>
            ¿Cómo nos conoció? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {HOW_FOUND_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("comoNosConocio", value)}
                className={`py-3 px-4 text-left font-nav text-[10px] tracking-[0.1em] uppercase border transition-colors ${
                  form.comoNosConocio === value
                    ? "bg-black text-white border-black"
                    : "border-black/10 text-black/50 hover:border-black hover:text-black bg-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-1.5">
          <Label htmlFor="direccion">
            Dirección donde Distribuirá la Marca <span className="text-red-500">*</span>
          </Label>
          <p className="font-sans text-[11px] text-black/50 -mt-0.5 mb-1">
            Descripción detallada del lugar donde distribuirá los productos
          </p>
          <textarea
            id="direccion"
            rows={3}
            placeholder="Ej: Av. Blanco Galindo Km 5, Galería XYZ, Local 23, Cochabamba"
            value={form.direccion}
            onChange={(e) => set("direccion", e.target.value)}
            className="flex w-full border border-black/10 bg-transparent px-4 py-3 font-sans text-sm text-black placeholder:text-black/50 outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        {/* Screenshots tienda online */}
        <div className="space-y-2">
          <Label>
            Capturas de Tienda Online{" "}
            <span className="font-sans normal-case text-[11px] text-black/50 tracking-normal">
              (opcional — máx. {MAX_FILES} archivos, {MAX_FILE_SIZE_MB} MB c/u)
            </span>
          </Label>
          <p className="font-sans text-[11px] text-black/50 leading-relaxed">
            Si vendes por Facebook Marketplace, TikTok Shop u otra plataforma, adjunta capturas de
            tu perfil como respaldo.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-dashed border-black/10 hover:border-black bg-transparent cursor-pointer px-4 py-8 text-center transition-colors"
          >
            <Upload size={20} className="mx-auto text-black/50 mb-2" strokeWidth={1.5} />
            <p className="font-nav text-[10px] tracking-[0.1em] uppercase text-black/50">
              Haz clic para seleccionar archivos
            </p>
            <p className="font-sans text-[11px] text-black/50 mt-1">JPG, PNG, WEBP, PDF</p>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {fileError && (
            <p className="flex items-center gap-1.5 font-sans text-[12px] text-red-600">
              <AlertCircle size={12} /> {fileError}
            </p>
          )}

          {files.length > 0 && (
            <ul className="space-y-1.5">
              {files.map((file, i) => (
                <li key={i} className="flex items-center justify-between bg-white/60 px-3 py-2">
                  <span className="font-sans text-[12px] text-black truncate max-w-[80%]">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-black/50 hover:text-red-500 transition-colors ml-2 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Error general */}
        {error && (
          <p className="flex items-center gap-2 font-sans text-[12px] text-red-600 border border-red-200 bg-red-50 px-3 py-2.5">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </p>
        )}

        {/* Submit */}
        <Button
          onClick={() => void handleSubmit()}
          disabled={!isValid || loading}
          size="lg"
          className="w-full mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando…
            </span>
          ) : (
            "Enviar Registro"
          )}
        </Button>
      </div>

      {/* WhatsApp CTA */}
      <Button
        variant="outline-white"
        size="sm"
        className="mt-5 w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
        asChild
      >
        <a
          href="https://api.whatsapp.com/send?phone=59165359595&text=%E2%9C%A8%20Hola%2C%20soy%20*Luana*%2C%20tu%20asesora%20de%20moda%20%F0%9F%A4%8D%0A%0AEstoy%20aqu%C3%AD%20para%20ayudarte%20a%20encontrar%20tu%20outfit%20ideal%20%F0%9F%92%AB%0A%0APuedes%20escribirme%20por%3A%0A%F0%9F%91%97%20Modelos%20disponibles%0A%F0%9F%93%8F%20Tallas%0A%F0%9F%92%B0%20Precios%0A%F0%9F%9A%9A%20Env%C3%ADos%0A%F0%9F%9B%8D%EF%B8%8F%20Pedidos%0A%0ATambi%C3%A9n%20puedes%20enviarme%20una%20foto%20del%20modelo%20que%20te%20guste%20%F0%9F%92%95%0A%0A%E2%9C%A8%20Stock%20limitado%0A%0A"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={14} />
          Contactar Asesora por WhatsApp
        </a>
      </Button>
    </div>
  );
}
