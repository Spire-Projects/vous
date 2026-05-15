import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type SetupState = "checking" | "available" | "unavailable";

export function RegisterPage() {
  const navigate = useNavigate();

  const [setupState, setSetupState] = useState<SetupState>("checking");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si ya existe un superadmin al cargar la página
  useEffect(() => {
    async function checkSetupAvailable() {
      try {
        const snap = await getDocs(
          query(
            collection(db, "adminUsers"),
            where("role", "==", "superadmin")
          )
        );
        setSetupState(snap.empty ? "available" : "unavailable");
      } catch {
        // Si las reglas de Firestore bloquean la lectura (DB vacía / sin auth),
        // asumimos que no hay superadmin y mostramos el formulario.
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
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      // Re-verify server-side that no superadmin exists yet (race condition guard)
      const existingSnap = await getDocs(
        query(collection(db, "adminUsers"), where("role", "==", "superadmin"))
      );
      if (!existingSnap.empty) {
        setError("Ya existe un superadmin. Esta página ya no está disponible.");
        setSetupState("unavailable");
        return;
      }

      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

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

      // Doc escrito — forzar re-auth para que onAuthStateChanged lo lea.
      // signOut cierra la sesión temporal, signIn la abre limpia con el doc ya listo.
      await signOut(auth);
      await signInWithEmailAndPassword(auth, email.trim(), password);

      navigate("/", { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";

      // Si algo falló después de crear el usuario en Auth, cerramos sesión
      // para que no quede autenticado sin doc en adminUsers.
      try { await signOut(auth); } catch { /* ignorar */ }

      if (code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado en Firebase Auth.");
      } else if (code === "auth/invalid-email") {
        setError("El correo ingresado no es válido.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Email/Password no está habilitado en Firebase Console. Ve a Authentication → Sign-in method y actívalo.");
      } else if (code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else if (code === "permission-denied") {
        setError("Firestore bloqueó la escritura. Revisa las reglas de seguridad en Firebase Console.");
      } else {
        setError(`Error: ${code || (err as Error).message || "No se pudo completar el registro."}`);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Estado: verificando ────────────────────────────────────────────────────
  if (setupState === "checking") {
    return (
      <div className="min-h-screen bg-vous-cream flex items-center justify-center">
        <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  // ── Estado: ya existe superadmin ───────────────────────────────────────────
  if (setupState === "unavailable") {
    return (
      <div className="min-h-screen bg-vous-cream flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-medium text-vous-black tracking-widest">VOUS</h1>
            <p className="text-[11px] font-nav uppercase tracking-[0.2em] text-vous-gold mt-1">Admin Portal</p>
          </div>
          <div className="bg-vous-white border border-vous-border p-8">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={32} className="text-amber-500" />
            </div>
            <h2 className="font-serif text-xl text-vous-black mb-3">Configuración no disponible</h2>
            <p className="text-sm text-vous-gray font-sans leading-relaxed mb-6">
              El panel ya está configurado. Si necesitas acceso, contacta al administrador principal de VOUS.
            </p>
            <Button asChild className="w-full h-11">
              <Link to="/login">Ir al inicio de sesión</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Estado: disponible para configurar ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-vous-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-medium text-vous-black tracking-widest">VOUS</h1>
          <p className="text-[11px] font-nav uppercase tracking-[0.2em] text-vous-gold mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-vous-white border border-vous-border p-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-vous-gold" />
            <h2 className="font-serif text-xl text-vous-black">Configuración Inicial</h2>
          </div>
          <p className="text-[11px] text-vous-gray font-nav mb-6">Crea la cuenta de superadministrador</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nombre */}
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">Nombre Completo</label>
              <Input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Pérez" />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">Correo Electrónico</label>
              <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="superadmin@vous.com" />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">Contraseña</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-black transition-colors" aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-vous-gray/60 font-sans mt-1">Mínimo 8 caracteres, una mayúscula y un número.</p>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">Confirmar Contraseña</label>
              <div className="relative">
                <Input type={showConfirm ? "text" : "password"} required autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-black transition-colors" aria-label={showConfirm ? "Ocultar contraseña" : "Ver contraseña"}>
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

        <p className="text-center text-[11px] text-vous-gray/60 font-nav mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-vous-gold hover:underline transition-colors">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
