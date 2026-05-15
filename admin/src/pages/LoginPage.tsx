import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Correo o contraseña incorrectos.");
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Intenta más tarde.");
      } else if (code === "auth/user-disabled") {
        setError("Esta cuenta ha sido desactivada. Contacta al superadmin.");
      } else {
        setError("Acceso no autorizado o cuenta inexistente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-vous-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-medium text-vous-black tracking-widest">
            VOUS
          </h1>
          <p className="text-[11px] font-nav uppercase tracking-[0.2em] text-vous-gold mt-1">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-vous-white border border-vous-border p-8">
          <h2 className="font-serif text-xl text-vous-black mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                Correo Electrónico
              </label>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vous.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-black transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs text-red-600 font-sans">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={14} />
              )}
              {loading ? "Autenticando..." : "Ingresar"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-[11px] text-vous-gray font-nav">
            Acceso restringido a personal autorizado de VOUS.
          </p>
          <p className="text-[11px] text-vous-gray/70 font-nav">
            ¿Primera vez?{" "}
            <Link
              to="/register"
              className="text-vous-gold hover:underline transition-colors"
            >
              Configurar panel
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

