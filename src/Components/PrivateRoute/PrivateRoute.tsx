import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../Contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
