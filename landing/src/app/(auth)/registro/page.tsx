"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

const DEPARTAMENTOS = [
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Tarija",
  "Beni",
  "Pando",
];

export default function RegistroPage() {
  const { createAccount } = useAuthContext();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createAccount(name, email, password);
      router.replace("/cuenta");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado. Inicia sesión.");
      } else if (code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (code === "auth/invalid-email") {
        setError("El correo electrónico no es válido.");
      } else {
        setError("Ocurrió un error. Intente de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">

        {/* Heading */}
        <div className="mb-10">
          <p className="font-nav text-[11px] font-semibold uppercase tracking-[0.22em] text-vous-gold mb-3">
            Nueva Cuenta
          </p>
          <h1 className="font-serif text-[38px] font-medium leading-[1.15] text-vous-soft-black">
            Crear Cuenta
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-vous-gray">
            Únete a la comunidad VOUS y accede a lanzamientos exclusivos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nombre */}
          <div>
            <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-2.5 font-sans text-[14px] text-vous-soft-black placeholder:text-vous-gray-light transition-colors duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-2.5 font-sans text-[14px] text-vous-soft-black placeholder:text-vous-gray-light transition-colors duration-200"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray mb-2">
              Número Celular
            </label>
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+591 7xxxxxxx"
              className="w-full bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-2.5 font-sans text-[14px] text-vous-soft-black placeholder:text-vous-gray-light transition-colors duration-200"
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray mb-2">
              Departamento
            </label>
            <div className="relative">
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="w-full appearance-none bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-2.5 pr-6 font-sans text-[14px] text-vous-soft-black transition-colors duration-200"
              >
                <option value="" disabled>Selecciona tu departamento</option>
                {DEPARTAMENTOS.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-vous-gray">
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-2.5 pr-8 font-sans text-[14px] text-vous-soft-black placeholder:text-vous-gray-light transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-soft-black transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={15} strokeWidth={1.5} />
                ) : (
                  <Eye size={15} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="font-sans text-[13px] text-red-600">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vous-soft-black text-vous-warm-white font-nav text-[11px] font-semibold uppercase tracking-[0.22em] py-4 hover:bg-vous-gold-dark disabled:opacity-50 transition-colors duration-300 mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registrando...
              </span>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-8 font-sans text-[13px] text-vous-gray text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-vous-soft-black hover:text-vous-gold transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
