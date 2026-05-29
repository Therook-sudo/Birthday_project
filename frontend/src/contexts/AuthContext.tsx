import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  authService,
  type RequestCodePayload,
  type VerifyCodePayload,
  type RequestCodeResponse,
} from "@/services/auth.service";

import { getAccessToken, setAccessToken } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  requestCode: (payload: RequestCodePayload) => Promise<RequestCodeResponse>;
  verifyCode: (payload: VerifyCodePayload) => Promise<void>;
  logout: () => Promise<void>;
  signup: (payload: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authService.me();
        if (!cancelled) setUser(me);
      } catch {
        setAccessToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signup = useCallback(async (payload: any) => {
    const res = await authService.signup(payload);
    setUser(res.user);
  }, []);

  const requestCode = useCallback(async (payload: RequestCodePayload) => {
    return authService.requestCode(payload);
  }, []);

  const verifyCode = useCallback(async (payload: VerifyCodePayload) => {
    const res = await authService.verifyCode(payload);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      requestCode,
      verifyCode,
      logout,
      signup,
    }),
    [user, loading, requestCode, verifyCode, logout, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}