// Thin fetch wrapper for the Node.js + Express backend.
// - Reads base URL from VITE_API_URL
// - Attaches JWT access token from localStorage
// - Throws a typed ApiError on non-2xx responses
// - Exposes hasApi() so services can fall back to mock data while backend is wired up

import type { ApiError } from "./types";

const RAW_BASE = (import.meta.env.VITE_API_URL ?? "").trim();
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

export const TOKEN_STORAGE_KEY = "auth.accessToken";

export function hasApi(): boolean {
  return API_BASE.length > 0;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // default true
  /** Skip JSON parsing (e.g. for 204 responses) */
  raw?: boolean;
}

export async function apiRequest<T = unknown>(
  path: string,
  { body, auth = true, raw = false, headers, ...rest }: RequestOptions = {},
): Promise<T> {
  if (!hasApi()) {
    throw {
      status: 0,
      message:
        "VITE_API_URL is not set. Configure your Express backend URL in .env to enable network calls.",
    } satisfies ApiError;
  }

  const finalHeaders = new Headers(headers);
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      credentials: "include",
    });
  } catch (e) {
    throw {
      status: 0,
      message: e instanceof Error ? e.message : "Network error",
    } satisfies ApiError;
  }

  if (!res.ok) {
    let details: unknown = undefined;
    try {
      details = await res.json();
    } catch {
      /* ignore */
    }
    throw {
      status: res.status,
      message:
        (details as { message?: string })?.message ??
        `Request failed with status ${res.status}`,
      details,
    } satisfies ApiError;
  }

  if (raw || res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};
