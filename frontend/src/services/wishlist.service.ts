import { api, hasApi } from "@/lib/api";
import type { ID, WishlistItem, WishlistPriority } from "@/lib/types";
import { mockResolve, mockWishlist } from "./mockData";

export interface CreateWishlistItemPayload {
  name: string;
  link?: string;
  note?: string;
  priority: WishlistPriority;
}

export const wishlistService = {
  async listMine(): Promise<WishlistItem[]> {
    if (!hasApi()) return mockResolve(mockWishlist);
    return api.get<WishlistItem[]>("/wishlist");
  },

  async listByUser(userId: string): Promise<WishlistItem[]> {
    if (!hasApi()) return mockResolve(mockWishlist);
    return api.get<WishlistItem[]>(`/wishlist/user/${userId}`, { auth: false });
  },

  async create(payload: CreateWishlistItemPayload): Promise<WishlistItem> {
    if (!hasApi()) return mockResolve({ id: Date.now(), ...payload });
    return api.post<WishlistItem>("/wishlist", payload);
  },

  async remove(id: ID): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.delete<void>(`/wishlist/${id}`);
  },

  async getShareLink(): Promise<{ url: string }> {
    if (!hasApi()) return mockResolve({ url: window.location.href });
    return api.get<{ url: string }>("/wishlist/share");
  },
};
