// Mock data used as a fallback when VITE_API_URL is not configured.
// Once the Express backend is live, services bypass this file entirely.

import type {
  Birthday,
  BirthdayRequest,
  NotificationItem,
  PremiumRequest,
  UpcomingBirthday,
  User,
  WishlistItem,
} from "@/lib/types";

export const mockUser: User = {
  id: "mock-user",
  email: "demo@birthdays.app",
  fullName: "Demo User",
  isPremium: false,
};

export const mockUpcoming: UpcomingBirthday[] = [
  { id: 1, fullName: "Sarah Johnson", day: 14, month: 2, hideYear: true, status: "approved", daysLeft: 9,  displayDate: "Feb 14", avatar: "SJ" },
  { id: 2, fullName: "Michael Chen",  day: 18, month: 2, hideYear: true, status: "approved", daysLeft: 13, displayDate: "Feb 18", avatar: "MC" },
  { id: 3, fullName: "Emily Williams",day: 22, month: 2, hideYear: true, status: "pending",  daysLeft: 17, displayDate: "Feb 22", avatar: "EW" },
  { id: 4, fullName: "James Brown",   day: 28, month: 2, hideYear: true, status: "approved", daysLeft: 23, displayDate: "Feb 28", avatar: "JB" },
];

export const mockMonthly: Record<string, Birthday[]> = {
  February: [
    { id: 1, fullName: "Sarah Johnson",  day: 14, month: 2, hideYear: true, status: "approved" },
    { id: 2, fullName: "Michael Chen",   day: 18, month: 2, hideYear: true, status: "approved" },
    { id: 3, fullName: "Emily Williams", day: 22, month: 2, hideYear: true, status: "pending" },
    { id: 4, fullName: "James Brown",    day: 28, month: 2, hideYear: true, status: "approved" },
  ],
  March: [
    { id: 5, fullName: "Anna Davis",     day: 3,  month: 3, hideYear: true, status: "approved" },
    { id: 6, fullName: "Robert Wilson",  day: 15, month: 3, hideYear: true, status: "approved" },
    { id: 7, fullName: "Lisa Martinez",  day: 21, month: 3, hideYear: true, status: "pending" },
  ],
  April: [
    { id: 8, fullName: "David Lee",      day: 7,  month: 4, hideYear: true, status: "approved" },
    { id: 9, fullName: "Jennifer Taylor",day: 19, month: 4, hideYear: true, status: "approved" },
  ],
};

export const mockPending: BirthdayRequest[] = [
  { id: 1, name: "Emily Williams", date: "Feb 22", email: "emily@example.com" },
  { id: 2, name: "Lisa Martinez",  date: "Mar 21", email: "lisa@example.com" },
];

export const mockWishlist: WishlistItem[] = [
  { id: 1, name: "AirPods Pro 2",       link: "https://apple.com", note: "White color",                priority: "High" },
  { id: 2, name: "Kindle Paperwhite",                                                                  priority: "Medium" },
  { id: 3, name: "Custom Photo Album",                              note: "Family photos from 2024",   priority: "Low" },
  { id: 4, name: "Running Shoes",       link: "https://nike.com",   note: "Size 10, black",            priority: "Medium" },
];

export const mockNotifications: NotificationItem[] = [
  { id: 1, message: "Sarah Johnson created a new wishlist",         time: "2 min ago",  read: false, link: "/wishlist/sarah" },
  { id: 2, message: "Michael Chen added 3 items to his wishlist",   time: "1 hr ago",   read: false, link: "/wishlist/michael" },
  { id: 3, message: "Emily Williams updated her wishlist priorities", time: "3 hrs ago", read: true, link: "/wishlist/emily" },
  { id: 4, message: "James Brown removed an item from his wishlist", time: "Yesterday", read: true,  link: "/wishlist/james" },
];

export const mockPremiumRequests: PremiumRequest[] = [
  { id: 1, person: "Sarah Johnson", method: "WhatsApp Voice Note", date: "Feb 14, 2026", status: "Scheduled" },
  { id: 2, person: "Michael Chen",  method: "Phone Call",          date: "Feb 18, 2026", status: "Delivered" },
];

/** Resolve mock data after a small delay so loading states render. */
export function mockResolve<T>(data: T, ms = 350): Promise<T> {
  return new Promise((r) => setTimeout(() => r(data), ms));
}
