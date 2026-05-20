import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { birthdaysService, type CreateBirthdayPayload } from "@/services/birthdays.service";
import type { ID } from "@/lib/types";

export const birthdayKeys = {
  all: ["birthdays"] as const,
  upcoming: () => [...birthdayKeys.all, "upcoming"] as const,
  monthly: () => [...birthdayKeys.all, "monthly"] as const,
  pending: () => [...birthdayKeys.all, "pending"] as const,
};

export function useUpcomingBirthdays() {
  return useQuery({ queryKey: birthdayKeys.upcoming(), queryFn: () => birthdaysService.upcoming() });
}

export function useMonthlyBirthdays() {
  return useQuery({ queryKey: birthdayKeys.monthly(), queryFn: () => birthdaysService.byMonth() });
}

export function usePendingRequests() {
  return useQuery({ queryKey: birthdayKeys.pending(), queryFn: () => birthdaysService.pending() });
}

export function useCreateBirthday() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBirthdayPayload) => birthdaysService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: birthdayKeys.all }),
  });
}

export function useAcceptRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => birthdaysService.acceptRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: birthdayKeys.all }),
  });
}

export function useDeclineRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => birthdaysService.declineRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: birthdayKeys.pending() }),
  });
}

export function useAcceptAllRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => birthdaysService.acceptAllRequests(),
    onSuccess: () => qc.invalidateQueries({ queryKey: birthdayKeys.all }),
  });
}
