import { api, hasApi } from "@/lib/api";
import type {
  Birthday,
  BirthdayRequest,
  ID,
  UpcomingBirthday,
} from "@/lib/types";
import {
  mockMonthly,
  mockPending,
  mockResolve,
  mockUpcoming,
} from "./mockData";

export interface CreateBirthdayPayload {
  fullName: string;
  day: number;
  month: number;
  year?: number | null;
  hideYear: boolean;
  religion?: string | null;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const birthdaysService = {
  async upcoming(): Promise<UpcomingBirthday[]> {
    if (!hasApi()) return mockResolve(mockUpcoming);
    return api.get<UpcomingBirthday[]>("/birthdays/upcoming");
  },

  async byMonth(): Promise<Record<string, Birthday[]>> {
    if (!hasApi()) return mockResolve(mockMonthly);
    return api.get<Record<string, Birthday[]>>("/birthdays/by-month");
  },

  async pending(): Promise<BirthdayRequest[]> {
    if (!hasApi()) return mockResolve(mockPending);
    return api.get<BirthdayRequest[]>("/birthdays/requests");
  },

  async create(payload: CreateBirthdayPayload): Promise<Birthday> {
    if (!hasApi()) {
      return mockResolve({
        id: Date.now(),
        status: "approved",
        ...payload,
      } as Birthday);
    }
    return api.post<Birthday>("/birthdays", payload);
  },

  async acceptRequest(id: ID): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>(`/birthdays/requests/${id}/accept`);
  },

  async declineRequest(id: ID): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>(`/birthdays/requests/${id}/decline`);
  },

  async acceptAllRequests(): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>("/birthdays/requests/accept-all");
  },

  /** Public submission via shareable link (no auth). */
  async submitPublic(token: string, payload: CreateBirthdayPayload): Promise<void> {
    if (!hasApi()) return mockResolve(undefined);
    return api.post<void>(`/public/collect/${token}`, payload, { auth: false });
  },
};
