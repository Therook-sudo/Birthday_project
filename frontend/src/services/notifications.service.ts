import { api, hasApi } from "@/lib/api";
import type { ID, NotificationItem } from "@/lib/types";
import { mockNotifications, mockResolve } from "./mockData";

export const notificationsService = {
  async list(): Promise<NotificationItem[]> {
    if (!hasApi()) return mockResolve(mockNotifications);
    return api.get<NotificationItem[]>("/notifications");
  },
  async markRead(id: ID): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>(`/notifications/${id}/read`);
  },
  async markAllRead(): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>("/notifications/read-all");
  },
};
