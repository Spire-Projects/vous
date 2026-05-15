"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      setError("Ingresa tu correo para restablecer la contraseña.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
      setError("");
    } catch {
      setError("No se pudo enviar el correo. Verifica que el correo sea correcto.");
    } finally {
      setResetLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/cuenta");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Correo electrónico o contraseña incorrectos.");
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Intente más tarde.");
      } else if (code === "auth/user-disabled") {
        setError("Esta cuenta ha sido desactivada.");
      } else {
        setError("Ocurrió un error. Intente de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">

        {/* Heading */}
        <div className="mb-10">
          <p className="font-nav text-[11px] font-semibold uppercase tracking-[0.22em] text-vous-gold mb-3">
            Bienvenido
          </p>
          <h1 className="font-serif text-[38px] font-medium leading-[1.15] text-vous-soft-black">
            Iniciar Sesión
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-vous-gray">
            Inicie sesión para acceder a su archivo personal y colecciones exclusivas.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray mb-2">
              Email
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-vous-gray">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => void handleReset()}
                disabled={resetLoading}
                className="font-nav text-[10px] font-semibold uppercase tracking-[0.12em] text-vous-gray hover:text-vous-gold transition-colors disabled:opacity-50"
              >
                {resetSent ? "Correo enviado ✓" : resetLoading ? "Enviando…" : "¿Olvidó su contraseña?"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-2.5 pr-8 font-sans text-[14px] text-vous-soft-black placeholder:text-vous-gray-light transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-soft-black transition-colors"
              >
                {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
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
                Autenticando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-8 font-sans text-[13px] text-vous-gray text-center">
          ¿Aún no tiene una cuenta?{" "}
          <Link
            href="/auth/registro"
            className="font-semibold text-vous-soft-black hover:text-vous-gold transition-colors"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
