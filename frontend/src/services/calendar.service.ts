import { api, hasApi, API_BASE } from "@/lib/api";
import type { CalendarConnection, CalendarProvider } from "@/lib/types";
import { mockResolve } from "./mockData";

export const calendarService = {
  async listConnections(): Promise<CalendarConnection[]> {
    if (!hasApi()) return mockResolve([]);
    return api.get<CalendarConnection[]>("/calendar/connections");
  },

  async getConnectUrl(provider: CalendarProvider): Promise<{ url: string }> {
    if (!hasApi()) return mockResolve({ url: "" });
    return api.get<{ url: string }>(`/calendar/${provider}/connect`);
  },

  /**
   * Returns the URL to redirect the user to start the OAuth flow.
   * The Express backend should expose `GET /calendar/:provider/connect`
   * which 302-redirects to the provider's OAuth consent screen.
   */
  oauthStartUrl(provider: CalendarProvider): string {
    return `${API_BASE}/calendar/${provider}/connect`;
  },

  async disconnect(provider: CalendarProvider): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.delete<void>(`/calendar/${provider}`);
  },

  async syncAll(provider: CalendarProvider): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>(`/calendar/${provider}/sync`);
  },
};
