import { api, hasApi } from "@/lib/api";
import type { DeliverWishPayload, PremiumRequest } from "@/lib/types";
import { mockPremiumRequests, mockResolve } from "./mockData";

export const premiumService = {
  async listRequests(): Promise<PremiumRequest[]> {
    if (!hasApi()) return mockResolve(mockPremiumRequests);
    return api.get<PremiumRequest[]>("/premium/requests");
  },

  async deliverWish(payload: DeliverWishPayload): Promise<PremiumRequest> {
    if (!hasApi()) {
      return mockResolve({
        id: Date.now(),
        person: payload.person,
        method: payload.method,
        date: payload.preferredDate,
        status: "Scheduled",
        message: payload.message,
        tone: payload.tone,
      });
    }
    return api.post<PremiumRequest>("/premium/deliver-wish", payload);
  },

  async upgrade(): Promise<{ checkoutUrl: string }> {
    if (!hasApi()) return mockResolve({ checkoutUrl: "" });
    return api.post<{ checkoutUrl: string }>("/premium/upgrade");
  },
};
