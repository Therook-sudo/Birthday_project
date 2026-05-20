import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Share2, Bell, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-60 -left-40 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Your personal birthday assistant</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Never Forget a{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Birthday
            </span>{" "}
            Again
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 text-lg text-muted-foreground md:text-xl"
          >
            Collect birthdays, sync them to your calendar, and send automated
            wishes to the people who matter most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/add-birthday">
                <Gift className="mr-2 h-5 w-5" />
                Add a Birthday
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/dashboard">
                <Calendar className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Visual Flow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Gift, label: "Add", desc: "Add birthdays" },
              { icon: Share2, label: "Share", desc: "Invite friends" },
              { icon: Calendar, label: "Sync", desc: "To calendar" },
              { icon: Bell, label: "Remind", desc: "Get notified" },
            ].map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="group relative"
              >
                <div className="gradient-card rounded-2xl border border-border p-6 text-center shadow-soft transition-all duration-300 hover:shadow-medium hover:border-primary/30">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground">{step.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="absolute right-0 top-1/2 hidden h-0.5 w-4 -translate-y-1/2 translate-x-full bg-border md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
