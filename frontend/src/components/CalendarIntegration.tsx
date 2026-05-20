import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { CalendarConnectModal } from "@/components/CalendarConnectModal";

const calendars = [
  {
    name: "Google Calendar",
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2H6v2h12V2h1.5A2.5 2.5 0 0122 4.5v15a2.5 2.5 0 01-2.5 2.5zM6 7v3h3V7H6zm4.5 0v3h3V7h-3zm4.5 0v3h3V7h-3zM6 11.5v3h3v-3H6zm4.5 0v3h3v-3h-3zm4.5 0v3h3v-3h-3zM6 16v3h3v-3H6zm4.5 0v3h3v-3h-3z"/>
      </svg>
    ),
    color: "text-calendar-google",
    bgColor: "bg-calendar-google/10",
    features: ["Automatic sync", "Event reminders", "Shared calendars"],
  },
  {
    name: "Microsoft Outlook",
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H8.21q-.48 0-.8-.33-.33-.32-.33-.8V18H1.13q-.47 0-.8-.32-.32-.33-.32-.8V7.13q0-.47.32-.8.33-.32.8-.32h6.95V3.62q0-.46.33-.8.32-.33.8-.33h14.54q.47 0 .8.33.33.34.33.8V12z"/>
      </svg>
    ),
    color: "text-calendar-microsoft",
    bgColor: "bg-calendar-microsoft/10",
    features: ["Office integration", "Teams support", "Mobile sync"],
  },
  {
    name: "Apple Calendar",
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
      </svg>
    ),
    color: "text-calendar-apple",
    bgColor: "bg-calendar-apple/10",
    features: ["iCloud sync", "Siri reminders", "All Apple devices"],
  },
];

export function CalendarIntegration() {
  const [provider, setProvider] = useState<"google" | "microsoft" | "apple" | null>(null);
  const open = provider !== null;

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Sync with Your Calendar
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect your favorite calendar app and never miss an important date
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {calendars.map((calendar, index) => (
            <motion.div
              key={calendar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group gradient-card rounded-2xl border border-border p-8 shadow-soft transition-all duration-300 hover:shadow-medium hover:border-primary/30"
            >
              <div className={`mb-6 inline-flex rounded-xl p-4 ${calendar.bgColor}`}>
                <span className={calendar.color}>{calendar.logo}</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">
                {calendar.name}
              </h3>
              <ul className="mb-6 space-y-3">
                {calendar.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="calendar"
                className="w-full"
                onClick={() =>
                  setProvider(
                    calendar.name.includes("Google")
                      ? "google"
                      : calendar.name.includes("Microsoft")
                      ? "microsoft"
                      : "apple"
                  )
                }
              >
                Connect {calendar.name.split(" ")[0]}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      <CalendarConnectModal
        open={open}
        onOpenChange={(o) => !o && setProvider(null)}
        provider={provider}
      />
    </section>
  );
}
