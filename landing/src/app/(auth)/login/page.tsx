"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
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
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
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
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="font-nav text-[11px] font-semibold uppercase tracking-[0.22em] text-vous-gold mb-3">
            Bienvenido
          </p>
          <h1 className="font-serif text-[36px] sm:text-[40px] font-medium leading-[1.1] text-vous-soft-black">
            Iniciar Sesión
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-vous-gray">
            Inicie sesión para acceder a su archivo personal y colecciones exclusivas.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full border border-vous-border bg-white/90 px-4 py-2.5 text-sm font-sans text-vous-soft-black placeholder:text-vous-text-muted rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-nav text-[10px] font-semibold uppercase tracking-[0.15em] text-vous-gray">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleReset()}
                    disabled={resetLoading}
                    className="font-nav text-[10px] font-semibold uppercase tracking-[0.12em] text-vous-gray hover:text-vous-gold transition-colors disabled:opacity-50"
                  >
                    {resetSent
                      ? "Correo enviado ✓"
                      : resetLoading
                        ? "Enviando…"
                        : "¿Olvidó su contraseña?"}
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
                    className="w-full border border-vous-border bg-white/90 px-4 py-2.5 pr-10 text-sm font-sans text-vous-soft-black placeholder:text-vous-text-muted rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-soft-black transition-colors"
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
                className="w-full flex items-center justify-center gap-2 bg-vous-soft-black text-white font-nav text-[11px] font-semibold uppercase tracking-[0.15em] py-3.5 rounded-xl hover:bg-vous-gold hover:text-vous-soft-black shadow-lg shadow-black/10 hover:shadow-amber-500/15 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200 mt-1"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <LogIn size={14} strokeWidth={2} />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

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
