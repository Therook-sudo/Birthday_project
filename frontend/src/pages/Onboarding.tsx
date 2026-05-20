import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Bell, Share2, Check } from "lucide-react";

const steps = [
  {
    icon: Gift,
    title: "Welcome to Birthdays",
    desc: "Never forget a birthday or important date again. Let's get you set up in 3 quick steps.",
  },
  {
    icon: Calendar,
    title: "Add the people you care about",
    desc: "Save birthdays for friends, family, and colleagues. You can hide birth years for privacy.",
  },
  {
    icon: Bell,
    title: "Stay on top of every date",
    desc: "Sync to Google, Outlook, or Apple Calendar and get reminders before each birthday.",
  },
  {
    icon: Share2,
    title: "Share your link to collect more",
    desc: "Send a shareable link so friends can submit their own birthdays automatically.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const Current = steps[step].icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md gradient-card rounded-3xl border border-border p-10 text-center shadow-medium"
      >
        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Current className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-foreground">{steps[step].title}</h1>
            <p className="mb-8 text-muted-foreground">{steps[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button
            variant="hero"
            className="flex-1"
            onClick={() => (isLast ? navigate("/add-birthday") : setStep(step + 1))}
          >
            {isLast ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Get Started
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>

        {!isLast && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-xs text-muted-foreground hover:text-primary"
          >
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  );
}
