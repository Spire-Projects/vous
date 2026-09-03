"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
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
      await createAccount(name, email, password, phone, departamento);
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
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[460px]">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="font-nav text-[11px] font-semibold uppercase tracking-[0.22em] text-black mb-3">
            Nueva Cuenta
          </p>
          <h1 className="font-serif text-[36px] sm:text-[40px] font-medium leading-[1.1] text-black">
            Crear Cuenta
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-black/50">
            Únete a la comunidad VOUS y accede a lanzamientos exclusivos.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full border border-black/10 bg-white/90 px-4 py-2.5 text-sm font-sans text-black placeholder:text-black/50 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full border border-black/10 bg-white/90 px-4 py-2.5 text-sm font-sans text-black placeholder:text-black/50 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition-all"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 mb-1.5">
                  Número Celular
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+591 7xxxxxxx"
                  className="w-full border border-black/10 bg-white/90 px-4 py-2.5 text-sm font-sans text-black placeholder:text-black/50 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition-all"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 mb-1.5">
                  Departamento
                </label>
                <div className="relative">
                  <select
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    className="w-full appearance-none border border-black/10 bg-white/90 px-4 py-2.5 pr-10 text-sm font-sans text-black rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition-all"
                  >
                    <option value="" disabled>
                      Selecciona tu departamento
                    </option>
                    {DEPARTAMENTOS.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/50">
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                      <path
                        d="M1 1l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 mb-1.5">
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
                    className="w-full border border-black/10 bg-white/90 px-4 py-2.5 pr-10 text-sm font-sans text-black placeholder:text-black/50 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.5} />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="border border-red-200 bg-red-50 px-3 py-2 rounded-xl">
                  <p className="text-xs text-red-600 font-sans">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-nav text-[11px] font-semibold uppercase tracking-[0.15em] py-3.5 rounded-xl hover:bg-black/80 shadow-lg shadow-black/10 hover:shadow-black/15 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200 mt-1"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus size={14} strokeWidth={2} />
                    Registrarse
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Login link */}
        <p className="mt-8 font-sans text-[13px] text-black/50 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-black hover:text-black transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
