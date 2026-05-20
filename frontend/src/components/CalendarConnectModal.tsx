import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { calendarService } from "@/services/calendar.service";
import { hasApi } from "@/lib/api";
import type { CalendarProvider } from "@/lib/types";

interface CalendarConnectModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  provider: CalendarProvider | null;
}

const labelFor: Record<CalendarProvider, string> = {
  google: "Google",
  microsoft: "Microsoft",
  apple: "Apple",
};

export function CalendarConnectModal({ open, onOpenChange, provider }: CalendarConnectModalProps) {
  const [stage, setStage] = useState<"intro" | "connecting" | "done">("intro");

  useEffect(() => {
    if (open) setStage("intro");
  }, [open, provider]);

  const start = () => {
    if (!provider) return;
    // Real backend flow: redirect to Express OAuth start endpoint.
    if (hasApi()) {
      window.location.href = calendarService.oauthStartUrl(provider);
      return;
    }
    // Mock flow for static preview.
    setStage("connecting");
    setTimeout(() => setStage("done"), 1200);
  };

  const label = provider ? labelFor[provider] : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {label} Calendar</DialogTitle>
          <DialogDescription>
            We'll add upcoming birthdays as recurring events with reminders.
          </DialogDescription>
        </DialogHeader>

        {stage === "intro" && (
          <div className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Read your calendars
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Create birthday events
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Set reminders
              </li>
            </ul>
            <Button variant="hero" className="w-full" onClick={start}>
              Continue with {label}
            </Button>
          </div>
        )}

        {stage === "connecting" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Connecting to {label}…</p>
          </div>
        )}

        {stage === "done" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Connected!</h3>
            <p className="text-sm text-muted-foreground">
              {label} Calendar is now syncing your birthdays.
            </p>
            <Button variant="hero" className="w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
