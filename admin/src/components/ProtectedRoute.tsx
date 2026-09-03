import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "superadmin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vous-bg">
        <p className="text-[11px] font-nav uppercase tracking-[0.2em] text-vous-text-secondary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vous-bg">
        <div className="text-center">
          <p className="font-serif text-2xl text-vous-text mb-2">Acceso Denegado</p>
          <p className="text-sm text-vous-text-secondary font-sans">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
