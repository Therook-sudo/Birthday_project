import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeliverWishModal } from "@/components/DeliverWishModal";
import {
  AlertCircle,
  Crown,
  Gift,
  Phone,
  MessageCircle,
  Video,
  Lock,
  Check,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePremiumRequests } from "@/hooks/usePremium";

export default function Premium() {
  const { user } = useAuth();
  // Falls back to local toggle when no auth context user (preview mode)
  const [demoPremium, setDemoPremium] = useState(false);
  const isPremium = user?.isPremium ?? demoPremium;
  const [modalOpen, setModalOpen] = useState(false);
  const requestsQuery = usePremiumRequests(isPremium);
  const requests = requestsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Badge className="mb-4 bg-accent/20 text-accent-foreground">
            <Crown className="mr-1 h-3 w-3" />
            Premium
          </Badge>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Let Us Deliver a Wish for You
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Go beyond a text message. We'll personally deliver your heartfelt wish via phone call, WhatsApp voice note, or video message.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 grid gap-6 md:grid-cols-3"
        >
          {[
            { icon: Phone, title: "Phone Call", desc: "A warm, personal phone call delivering your custom message" },
            { icon: MessageCircle, title: "WhatsApp Voice Note", desc: "A heartfelt voice note sent directly via WhatsApp" },
            { icon: Video, title: "Video Message", desc: "A professionally crafted video with your personalized wish" },
          ].map((feature) => (
            <div key={feature.title} className="gradient-card rounded-xl border border-border p-6 text-center shadow-soft">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center shadow-soft"
        >
          {isPremium ? (
            <>
              <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-3">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Ready to Deliver a Wish?</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Choose a contact, pick a delivery method, and write your message. We'll handle the rest.
              </p>
              <Button variant="hero" size="lg" className="mt-6" onClick={() => setModalOpen(true)}>
                <Gift className="mr-2 h-5 w-5" />
                Deliver a Wish
              </Button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 inline-flex rounded-full bg-muted p-3">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Unlock Wish Delivery</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Upgrade to Premium to access personalized wish delivery. Starting at $4.99/wish.
              </p>
              <Button variant="hero" size="lg" className="mt-6" onClick={() => setDemoPremium(true)}>
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">Demo: clicking will simulate premium access</p>
            </>
          )}
        </motion.div>

        {/* My Premium Requests */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="gradient-card rounded-xl border border-border p-6 shadow-soft">
              <h2 className="mb-4 text-lg font-semibold text-foreground">My Premium Requests</h2>
              {requestsQuery.isLoading ? (
                <Skeleton className="h-24 w-full rounded-lg" />
              ) : requestsQuery.isError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Could not load your requests.</AlertDescription>
                </Alert>
              ) : requests.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No requests yet</p>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{req.person}</div>
                          <div className="text-sm text-muted-foreground">
                            {req.method} · {req.date}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={req.status === "Delivered" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"}
                      >
                        {req.status === "Delivered" ? (
                          <><Check className="mr-1 h-3 w-3" /> Delivered</>
                        ) : (
                          <><Clock className="mr-1 h-3 w-3" /> {req.status}</>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
      <DeliverWishModal open={modalOpen} onOpenChange={setModalOpen} isPremium={isPremium} />
    </div>
  );
}
