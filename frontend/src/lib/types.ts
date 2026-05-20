// Shared TypeScript interfaces mirroring backend Prisma models / DTOs.
// Keep these in sync with the Express API contract.

export type ID = string | number;

export interface User {
  id: ID;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  isPremium: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export type ReligionCategory = "christian" | "muslim" | "none";

export interface Birthday {
  id: ID;
  fullName: string;
  day: number;
  month: number;
  year?: number | null;
  hideYear: boolean;
  religion?: ReligionCategory | null;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  status: "approved" | "pending";
  ownerId?: ID;
  createdAt?: string;
}

export interface UpcomingBirthday extends Birthday {
  daysLeft: number;
  displayDate: string; // e.g. "Feb 14"
  avatar: string;     // initials
}

export interface BirthdayRequest {
  id: ID;
  name: string;
  date: string;
  email: string;
  fullName?: string;
  day?: number;
  month?: number;
  year?: number | null;
}

export type WishlistPriority = "Low" | "Medium" | "High";

export interface WishlistItem {
  id: ID;
  name: string;
  link?: string;
  note?: string;
  priority: WishlistPriority;
  ownerId?: ID;
}

export interface NotificationItem {
  id: ID;
  message: string;
  time: string;       // human readable, server-formatted
  createdAt?: string; // ISO
  read: boolean;
  link: string;
}

export type CalendarProvider = "google" | "microsoft" | "apple";

export interface CalendarConnection {
  id: ID;
  provider: CalendarProvider;
  connectedAt: string;
  email?: string;
}

export type DeliveryMethod = "call" | "whatsapp" | "video";

export interface PremiumRequest {
  id: ID;
  person: string;
  method: DeliveryMethod | string;
  date: string;
  status: "Scheduled" | "Delivered" | "Pending" | "Cancelled";
  message?: string;
  tone?: string;
}

export interface DeliverWishPayload {
  contactId?: ID;
  person: string;
  method: DeliveryMethod;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:mm
  message: string;
  tone?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
