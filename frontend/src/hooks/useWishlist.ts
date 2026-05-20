import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService, type CreateWishlistItemPayload } from "@/services/wishlist.service";
import type { ID } from "@/lib/types";

export const wishlistKeys = {
  all: ["wishlist"] as const,
  mine: () => [...wishlistKeys.all, "mine"] as const,
  byUser: (userId: string) => [...wishlistKeys.all, "user", userId] as const,
};

export function useMyWishlist() {
  return useQuery({ queryKey: wishlistKeys.mine(), queryFn: () => wishlistService.listMine() });
}

export function useUserWishlist(userId?: string) {
  return useQuery({
    queryKey: userId ? wishlistKeys.byUser(userId) : wishlistKeys.mine(),
    queryFn: () => (userId ? wishlistService.listByUser(userId) : wishlistService.listMine()),
  });
}

export function useAddWishlistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWishlistItemPayload) => wishlistService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}

export function useRemoveWishlistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => wishlistService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}
