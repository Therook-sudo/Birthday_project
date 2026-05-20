import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { premiumService } from "@/services/premium.service";
import type { DeliverWishPayload } from "@/lib/types";

export const premiumKeys = {
  all: ["premium"] as const,
  requests: () => [...premiumKeys.all, "requests"] as const,
};

export function usePremiumRequests(enabled = true) {
  return useQuery({
    queryKey: premiumKeys.requests(),
    queryFn: () => premiumService.listRequests(),
    enabled,
  });
}

export function useDeliverWish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeliverWishPayload) => premiumService.deliverWish(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: premiumKeys.requests() }),
  });
}
