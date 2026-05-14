import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Credenciales inválidas o acceso no autorizado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F1F0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-['Bodoni_Moda'] text-4xl font-medium text-[#1A1A1A] tracking-widest">VOUS</h1>
          <p className="text-[11px] font-['Montserrat'] uppercase tracking-[0.2em] text-[#C9A84C] mt-1">Admin Portal</p>
        </div>

        <div className="bg-white border border-[#E8E5E1] p-8">
          <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A] mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E8E5E1] px-3 py-2.5 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors"
                placeholder="admin@vous.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E8E5E1] px-3 py-2.5 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-['Inter']">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A1A1A] text-white text-[12px] font-['Montserrat'] uppercase tracking-[0.15em] hover:bg-[#333] disabled:opacity-50 transition-colors"
            >
              {loading ? "Autenticando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#9E9E9E] font-['Montserrat'] mt-6">
          Acceso restringido a personal autorizado de VOUS.
        </p>
      </div>
    </div>
  );
}
