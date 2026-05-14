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
      <div className="min-h-screen flex items-center justify-center bg-[#F2F1F0]">
        <p className="text-[11px] font-['Montserrat'] uppercase tracking-[0.2em] text-[#9E9E9E]">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F1F0]">
        <div className="text-center">
          <p className="font-['Bodoni_Moda'] text-2xl text-[#1A1A1A] mb-2">Acceso Denegado</p>
          <p className="text-sm text-[#9E9E9E] font-['Inter']">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
