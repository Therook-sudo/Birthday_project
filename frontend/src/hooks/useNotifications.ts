import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";

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
      // Immediately remove all notifications from the UI
      qc.setQueryData(notificationKeys.all, []);

      // Optional: refresh after one minute
      setTimeout(() => {
        qc.invalidateQueries({
          queryKey: notificationKeys.all,
        });
      }, 60000);
    },
  });
}