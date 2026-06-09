import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection, query, where, getDocs, doc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

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

type SetupState = "checking" | "available" | "unavailable";

function LogoHeader({ logoUrl, storeName }: { logoUrl?: string; storeName: string }) {
  return (
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
  );
}

function FooterLinks({ storeName }: { storeName: string }) {
  return (
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
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();

  const [setupState, setSetupState] = useState<SetupState>("checking");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSetupAvailable() {
      try {
        const snap = await getDocs(
          query(collection(db, "adminUsers"), where("role", "==", "superadmin"))
        );
        setSetupState(snap.empty ? "available" : "unavailable");
      } catch {
        setSetupState("available");
      }
    }
    checkSetupAvailable();
  }, []);

  function validatePassword(pwd: string): string | null {
    if (pwd.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(pwd)) return "Debe incluir al menos una letra mayúscula.";
    if (!/[0-9]/.test(pwd)) return "Debe incluir al menos un número.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const pwdError = validatePassword(password);
    if (pwdError) { setError(pwdError); return; }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const existingSnap = await getDocs(
        query(collection(db, "adminUsers"), where("role", "==", "superadmin"))
      );
      if (!existingSnap.empty) {
        setError("Ya existe un superadmin. Esta página ya no está disponible.");
        setSetupState("unavailable");
        return;
      }

      const { user: newUser } = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await setDoc(doc(db, "adminUsers", newUser.uid), {
        uid: newUser.uid,
        email: email.trim(),
        name: name.trim(),
        role: "superadmin",
        isActive: true,
        permissions: [],
        createdBy: newUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await signOut(auth);
      await signInWithEmailAndPassword(auth, email.trim(), password);

      navigate("/", { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      try { await signOut(auth); } catch { /* ignore */ }

      if (code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado en Firebase Auth.");
      } else if (code === "auth/invalid-email") {
        setError("El correo ingresado no es válido.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Email/Password no está habilitado en Firebase Console.");
      } else if (code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else if (code === "permission-denied") {
        setError("Firestore bloqueó la escritura. Revisa las reglas de seguridad.");
      } else {
        setError(`Error: ${code || (err as Error).message || "No se pudo completar el registro."}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const storeName = config?.storeName ?? "VOUS";
  const logoUrl = config?.logoUrl;

  if (setupState === "checking") {
    return (
      <div className="min-h-screen bg-vous-bg flex items-center justify-center">
        <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (setupState === "unavailable") {
    return (
      <div className="min-h-screen bg-vous-bg flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <LogoHeader logoUrl={logoUrl} storeName={storeName} />
            <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6 sm:p-8">
              <div className="flex justify-center mb-4">
                <AlertTriangle size={32} className="text-amber-600" />
              </div>
              <h2 className="font-serif text-xl text-vous-text mb-3">Configuración no disponible</h2>
              <p className="text-sm text-vous-text-secondary font-sans leading-relaxed mb-6">
                El panel ya está configurado. Si necesitas acceso, contacta al administrador principal de VOUS.
              </p>
              <Button asChild className="w-full h-11">
                <Link to="/login">Ir al inicio de sesión</Link>
              </Button>
            </div>
          </div>
        </div>
        <FooterLinks storeName={storeName} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vous-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <LogoHeader logoUrl={logoUrl} storeName={storeName} />

          <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-vous-gold" />
              <h2 className="font-serif text-xl text-vous-text">Configuración Inicial</h2>
            </div>
            <p className="text-[11px] text-vous-text-secondary font-nav mb-6">
              Crea la cuenta de superadministrador
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">
                  Nombre Completo
                </label>
                <Input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Pérez" />
              </div>

              <div>
                <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">
                  Correo Electrónico
                </label>
                <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="superadmin@vous.com" />
              </div>

              <div>
                <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-text-secondary hover:text-vous-text transition-colors" aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-vous-text-muted font-sans mt-1">Mínimo 8 caracteres, una mayúscula y un número.</p>
              </div>

              <div>
                <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Input type={showConfirm ? "text" : "password"} required autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-text-secondary hover:text-vous-text transition-colors" aria-label={showConfirm ? "Ocultar contraseña" : "Ver contraseña"}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600 font-sans">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                {loading ? "Configurando..." : "Crear Cuenta Superadmin"}
              </Button>
            </form>
          </div>

          <p className="text-center text-[11px] text-vous-text-muted font-nav mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-vous-gold hover:underline transition-colors">Iniciar sesión</Link>
          </p>
        </div>
      </div>

      <FooterLinks storeName={storeName} />
    </div>
  );
}
