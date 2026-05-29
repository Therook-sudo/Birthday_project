import { api, hasApi, setAccessToken } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";
import { mockResolve, mockUser } from "./mockData";

export interface RequestCodePayload {
  email: string;
  fullName?: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
  fullName?: string;
}

export interface RequestCodeResponse {
  message: string;
  email: string;
  code?: string;
}

export const authService = {
  async signup(
    payload: any
  ): Promise<AuthResponse> {
    if (!hasApi()) {
      const res: AuthResponse = {
        user: {
          ...mockUser,
          email: payload.email,
          fullName: payload.fullName,
        },
        accessToken: "mock-token",
      };

      setAccessToken(res.accessToken);

      return mockResolve(res);
    }

    const res = await api.post<AuthResponse>(
      "/auth/signup",
      payload,
      { auth: false }
    );

    setAccessToken(res.accessToken);

    return res;
  },

  async requestCode(
    payload: RequestCodePayload
  ): Promise<RequestCodeResponse> {
    if (!hasApi()) {
      return mockResolve({
        message: "Verification code sent.",
        email: payload.email,
        code: "12345",
      });
    }

    return api.post<RequestCodeResponse>(
      "/auth/request-code",
      payload,
      { auth: false }
    );
  },

  async verifyCode(
    payload: VerifyCodePayload
  ): Promise<AuthResponse> {
    if (!hasApi()) {
      const res: AuthResponse = {
        user: {
          ...mockUser,
          email: payload.email,
          fullName: payload.fullName || mockUser.fullName,
        },
        accessToken: "mock-token",
      };

      setAccessToken(res.accessToken);

      return mockResolve(res);
    }

    const res = await api.post<AuthResponse>(
      "/auth/verify-code",
      payload,
      { auth: false }
    );

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