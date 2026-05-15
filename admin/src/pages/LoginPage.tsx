import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-[#F2F1F0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-['Bodoni_Moda'] text-4xl font-medium text-[#1A1A1A] tracking-widest">
            VOUS
          </h1>
          <p className="text-[11px] font-['Montserrat'] uppercase tracking-[0.2em] text-[#C9A84C] mt-1">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E5E1] p-8">
          <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A] mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E8E5E1] px-3 py-2.5 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors bg-white"
                placeholder="admin@vous.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E8E5E1] px-3 py-2.5 pr-10 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs text-red-600 font-['Inter']">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-white text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] hover:bg-[#333] disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={14} />
              )}
              {loading ? "Autenticando..." : "Ingresar"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-[11px] text-[#9E9E9E] font-['Montserrat']">
            Acceso restringido a personal autorizado de VOUS.
          </p>
          <p className="text-[11px] text-[#BDBDBD] font-['Montserrat']">
            ¿Primera vez?{" "}
            <Link
              to="/register"
              className="text-[#C9A84C] hover:underline transition-colors"
            >
              Configurar panel
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

