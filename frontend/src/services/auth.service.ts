import { api, hasApi, setAccessToken } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";
import { mockResolve, mockUser } from "./mockData";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (!hasApi()) {
      const res: AuthResponse = { user: { ...mockUser, email: payload.email }, accessToken: "mock-token" };
      setAccessToken(res.accessToken);
      return mockResolve(res);
    }
    const res = await api.post<AuthResponse>("/auth/login", payload, { auth: false });
    setAccessToken(res.accessToken);
    return res;
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    if (!hasApi()) {
      const res: AuthResponse = {
        user: { ...mockUser, email: payload.email, fullName: payload.fullName },
        accessToken: "mock-token",
      };
      setAccessToken(res.accessToken);
      return mockResolve(res);
    }
    const res = await api.post<AuthResponse>("/auth/signup", payload, { auth: false });
    setAccessToken(res.accessToken);
    return res;
  },

  async me(): Promise<User> {
    if (!hasApi()) return mockResolve(mockUser);
    return api.get<User>("/auth/me");
  },

  async logout(): Promise<void> {
    setAccessToken(null);
    if (!hasApi()) return;
    try {
      await api.post<void>("/auth/logout");
    } catch {
      /* ignore */
    }
  },
};
