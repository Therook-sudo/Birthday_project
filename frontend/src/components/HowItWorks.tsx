import { motion } from "framer-motion";
import { Gift, Share2, Calendar, Bell, MessageSquare, Check } from "lucide-react";

const steps = [
  {
    icon: Gift,
    title: "Add a Birthday",
    description: "Enter the name, day, and month. Year is optional and can be hidden for privacy.",
    features: ["Day & Month only", "Year optional", "Privacy controls"],
  },
  {
    icon: Share2,
    title: "Share & Collect",
    description: "Share your unique link with friends and family to collect their birthdays effortlessly.",
    features: ["Shareable links", "Easy collection", "Auto-import"],
  },
  {
    icon: Calendar,
    title: "Sync to Calendar",
    description: "Connect with Google, Microsoft, or Apple Calendar for seamless integration.",
    features: ["Google Calendar", "Microsoft Outlook", "Apple Calendar"],
  },
  {
    icon: Bell,
    title: "Get Reminders",
    description: "Receive timely notifications so you never miss an important date.",
    features: ["Email reminders", "Push notifications", "Custom timing"],
  },
  {
    icon: MessageSquare,
    title: "Send Wishes",
    description: "Use pre-written templates or customize your message before sending.",
    features: ["WhatsApp", "LinkedIn", "Facebook & more"],
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple five-step process to never miss another birthday
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:left-1/2 md:-translate-x-0.5 lg:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col gap-8 lg:flex-row lg:items-center ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Step number indicator */}
                <div className="absolute left-8 top-0 z-10 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground lg:left-1/2 lg:flex">
                  {index + 1}
                </div>

                <div className={`flex-1 ${index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                  <div className="gradient-card rounded-2xl border border-border p-8 shadow-soft transition-all duration-300 hover:shadow-medium">
                    <div className={`flex items-center gap-4 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <step.icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 text-sm font-medium text-primary">
                          Step {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className={`mt-4 text-muted-foreground ${index % 2 === 0 ? "lg:text-right" : ""}`}>
                      {step.description}
                    </p>
                    <div className={`mt-4 flex flex-wrap gap-2 ${index % 2 === 0 ? "lg:justify-end" : ""}`}>
                      {step.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          <Check className="h-3 w-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
