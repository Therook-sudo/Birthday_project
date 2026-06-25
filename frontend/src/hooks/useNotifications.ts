import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import type { ID } from "@/lib/types";

export const notificationKeys = {
  all: ["notifications"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => notificationsService.list(),
    refetchInterval: 60_000,
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),

    onSuccess: () => {
      qc.setQueryData(notificationKeys.all, []);

      setTimeout(() => {
        qc.invalidateQueries({
          queryKey: notificationKeys.all,
        });
      }, 60000);
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: ID) => notificationsService.markRead(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}