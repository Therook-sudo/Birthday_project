import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { hasApi } from "@/lib/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Gate routes behind authentication.
 * - While bootstrapping the session, render a loading spinner.
 * - If unauthenticated, redirect to /login and remember where the user was going.
 *
 * NOTE: When VITE_API_URL is not set, we don't enforce auth so the static
 * preview keeps working. Once the Express backend is wired up, auth applies.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (!hasApi()) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
