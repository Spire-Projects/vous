import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const LANDING_URL = (import.meta.env?.VITE_LANDING_URL as string | undefined) ?? "http://localhost:3000";

const FOOTER_LINKS = [
  {
    title: "Plataforma",
    links: [
      { href: `${LANDING_URL}`, label: "Inicio" },
      { href: `${LANDING_URL}/catalogo`, label: "Catálogo" },
      { href: `${LANDING_URL}/revista`, label: "Blog de Moda" },
      { href: `${LANDING_URL}/nosotros`, label: "Nosotros" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: `${LANDING_URL}/politica-de-envios`, label: "Envíos" },
      { href: `${LANDING_URL}/politica-de-devoluciones`, label: "Devoluciones" },
      { href: `${LANDING_URL}/terminos`, label: "Términos" },
    ],
  },
  {
    title: "Mayoristas",
    links: [
      { href: `${LANDING_URL}/mayoristas`, label: "Portal Mayorista" },
      { href: `${LANDING_URL}/mayoristas/catalogo`, label: "Catálogo Mayoreo" },
    ],
  },
];

export function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const { config } = useSiteConfig();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
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

  const storeName = config?.storeName ?? "VOUS";
  const logoUrl = config?.logoUrl;

  return (
    <div className="min-h-screen bg-vous-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Header — Logo */}
          <div className="text-center mb-10">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="h-10 w-auto object-contain mx-auto"
              />
            ) : (
              <h1 className="font-serif text-4xl font-medium text-vous-text tracking-widest">
                {storeName}
              </h1>
            )}
            <p className="text-[11px] font-nav uppercase tracking-[0.2em] text-vous-gold mt-2">
              Admin Portal
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6 sm:p-8">
            <h2 className="font-serif text-xl text-vous-text mb-6">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">
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

              <div>
                <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-text-secondary hover:text-vous-text transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600 font-sans">{error}</p>
                </div>
              )}

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

          {/* First-time setup link */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-vous-text-secondary/70 font-nav">
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

      {/* Footer — Platform Links */}
      <footer className="border-t border-white/40 bg-white/90 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title}>
                <h3 className="font-nav text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-3">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-xs text-vous-text-secondary hover:text-vous-text transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/40">
            <p className="text-center text-[10px] font-nav text-vous-text-muted uppercase tracking-wider">
              © {storeName} — Acceso restringido a personal autorizado
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
