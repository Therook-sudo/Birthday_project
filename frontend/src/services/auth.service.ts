import { api, hasApi, setAccessToken } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";
import { mockResolve, mockUser } from "./mockData";

export interface SecurityQuestionPayload {
  securityQuestion: string;
  securityAnswer: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  phone?: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface SetSecurityQuestionPayload {
  securityQuestion: string;
  securityAnswer: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  email: string;
  securityQuestion: string;
}

export interface ResetPasswordPayload {
  email: string;
  securityAnswer: string;
  newPassword: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (!hasApi()) {
      const res: AuthResponse = {
        user: { ...mockUser, email: payload.email },
        accessToken: "mock-token",
      };

      setAccessToken(res.accessToken);
      return mockResolve(res);
    }

    const res = await api.post<AuthResponse>("/auth/login", payload, {
      auth: false,
    });

    setAccessToken(res.accessToken);
    return res;
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    if (!hasApi()) {
      const res: AuthResponse = {
        user: {
          ...mockUser,
          email: payload.email,
          fullName: payload.fullName,
          birthDate: payload.birthDate,
        },
        accessToken: "mock-token",
      };

      setAccessToken(res.accessToken);
      return mockResolve(res);
    }

    const res = await api.post<AuthResponse>("/auth/signup", payload, {
      auth: false,
    });

    setAccessToken(res.accessToken);
    return res;
  },

  async me(): Promise<User> {
    if (!hasApi()) return mockResolve(mockUser);

    return api.get<User>("/auth/me");
  },

  async setSecurityQuestion(
    payload: SetSecurityQuestionPayload
  ): Promise<User> {
    if (!hasApi()) {
      return mockResolve({
        ...mockUser,
        securityQuestion: payload.securityQuestion,
      });
    }

    return api.post<User>("/auth/security-question", payload);
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ForgotPasswordResponse> {
    if (!hasApi()) {
      return mockResolve({
        email: payload.email,
        securityQuestion: "What is your first school name?",
      });
    }

    return api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      payload,
      { auth: false }
    );
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ message: string }> {
    if (!hasApi()) {
      return mockResolve({
        message: "Password reset successfully.",
      });
    }

    return api.post<{ message: string }>(
      "/auth/reset-password",
      payload,
      { auth: false }
    );
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