import { useQuery } from "@tanstack/react-query";
import { calendarService } from "@/services/calendar.service";

export const calendarKeys = {
  all: ["calendar"] as const,
  connections: () => [...calendarKeys.all, "connections"] as const,
};

export function useCalendarConnections() {
  return useQuery({
    queryKey: calendarKeys.connections(),
    queryFn: () => calendarService.listConnections(),
  });
}

export { calendarService };
