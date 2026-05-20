import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Gift,
  Clock,
  Users,
  Check,
  Plus,
  Share2,
  Bell,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DeliverWishModal } from "@/components/DeliverWishModal";
import { ShareModal } from "@/components/ShareModal";
import { CalendarConnectModal } from "@/components/CalendarConnectModal";
import { useToast } from "@/hooks/use-toast";
import {
  useAcceptAllRequests,
  useAcceptRequest,
  useDeclineRequest,
  useMonthlyBirthdays,
  usePendingRequests,
  useUpcomingBirthdays,
} from "@/hooks/useBirthdays";
import type { ID } from "@/lib/types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [deliverOpen, setDeliverOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const upcomingQuery = useUpcomingBirthdays();
  const monthlyQuery = useMonthlyBirthdays();
  const pendingQuery = usePendingRequests();

  const acceptMut = useAcceptRequest();
  const declineMut = useDeclineRequest();
  const acceptAllMut = useAcceptAllRequests();

  const upcoming = upcomingQuery.data ?? [];
  const monthly = monthlyQuery.data ?? {};
  const pending = pendingQuery.data ?? [];

  const acceptRequest = async (id: ID) => {
    try {
      await acceptMut.mutateAsync(id);
      toast({ title: "Request accepted", description: "Birthday added to your list." });
    } catch {
      toast({ title: "Could not accept request", variant: "destructive" });
    }
  };
  const declineRequest = async (id: ID) => {
    try {
      await declineMut.mutateAsync(id);
      toast({ title: "Request declined" });
    } catch {
      toast({ title: "Could not decline request", variant: "destructive" });
    }
  };
  const acceptAll = async () => {
    if (!pending.length) return;
    try {
      await acceptAllMut.mutateAsync();
      toast({ title: "All requests accepted" });
    } catch {
      toast({ title: "Could not accept all", variant: "destructive" });
    }
  };

  const stats = [
    { icon: Gift,  label: "Total Birthdays",      value: String(upcoming.length + Object.values(monthly).flat().length), color: "text-primary" },
    { icon: Clock, label: "This Month",            value: String(upcoming.length),                                         color: "text-accent" },
    { icon: Users, label: "Pending Requests",      value: String(pending.length),                                          color: "text-muted-foreground" },
    { icon: Bell,  label: "Upcoming (7 days)",     value: String(upcoming.filter((b) => b.daysLeft <= 7).length),          color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your birthdays and calendar connections
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link to="/add-birthday">
                <Plus className="mr-2 h-4 w-4" />
                Add Birthday
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 grid gap-4 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="gradient-card rounded-xl border border-border p-6 shadow-soft">
              <div className={`mb-3 inline-flex rounded-lg bg-muted p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {upcomingQuery.isLoading ? <Skeleton className="h-7 w-10" /> : stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-background">
                <Clock className="mr-2 h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-background">
                <Calendar className="mr-2 h-4 w-4" />
                By Month
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-background">
                <Users className="mr-2 h-4 w-4" />
                Pending
                {pending.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Birthdays */}
            <TabsContent value="upcoming" className="space-y-4">
              <div className="gradient-card rounded-xl border border-border p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Upcoming Birthdays</h2>
                  <Button variant="outline" size="sm" onClick={() => setCalendarOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Add All to Calendar
                  </Button>
                </div>

                {upcomingQuery.isLoading ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                ) : upcomingQuery.isError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Could not load upcoming birthdays.</AlertDescription>
                  </Alert>
                ) : upcoming.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Gift className="mx-auto mb-3 h-10 w-10 opacity-40" />
                    No upcoming birthdays. Add one to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {b.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{b.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {b.displayDate} · {b.daysLeft} days left
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={b.status === "approved" ? "default" : "secondary"}
                            className={b.status === "approved" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                          >
                            {b.status === "approved" ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Added
                              </>
                            ) : (
                              "Pending"
                            )}
                          </Badge>
                          <Button asChild variant="ghost" size="sm" className="text-xs">
                            <Link to={`/wishlist/${b.fullName.toLowerCase().split(" ")[0]}`}>
                              <Gift className="mr-1 h-3 w-3" />
                              Wishlist
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Monthly View */}
            <TabsContent value="monthly" className="space-y-6">
              {monthlyQuery.isLoading ? (
                <Skeleton className="h-40 w-full rounded-xl" />
              ) : monthlyQuery.isError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Could not load monthly birthdays.</AlertDescription>
                </Alert>
              ) : Object.keys(monthly).length === 0 ? (
                <div className="gradient-card rounded-xl border border-border p-12 text-center text-muted-foreground shadow-soft">
                  No birthdays yet.
                </div>
              ) : (
                Object.entries(monthly).map(([month, birthdays]) => (
                  <div key={month} className="gradient-card rounded-xl border border-border p-6 shadow-soft">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">{month}</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {birthdays.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                              {b.day}
                            </div>
                            <span className="font-medium text-foreground">{b.fullName}</span>
                          </div>
                          <Badge
                            variant={b.status === "approved" ? "default" : "secondary"}
                            className={b.status === "approved" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                          >
                            {b.status === "approved" ? "Added" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Pending Requests */}
            <TabsContent value="pending" className="space-y-4">
              <div className="gradient-card rounded-xl border border-border p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Pending Requests</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptAll}
                    disabled={!pending.length || acceptAllMut.isPending}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {acceptAllMut.isPending ? "Accepting…" : "Accept All"}
                  </Button>
                </div>
                {pendingQuery.isLoading ? (
                  <Skeleton className="h-24 w-full rounded-lg" />
                ) : pendingQuery.isError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Could not load pending requests.</AlertDescription>
                  </Alert>
                ) : pending.length > 0 ? (
                  <div className="space-y-3">
                    {pending.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                      >
                        <div>
                          <div className="font-medium text-foreground">{request.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.date} · {request.email}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => declineRequest(request.id)}
                            disabled={declineMut.isPending}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => acceptRequest(request.id)}
                            disabled={acceptMut.isPending}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">No pending requests</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Premium Deliver a Wish CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center shadow-soft"
        >
          <h2 className="text-lg font-semibold text-foreground">✨ Let Us Deliver a Wish for You</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Go beyond a text. We'll personally deliver your message via call, voice note, or video.
          </p>
          <Button variant="hero" size="sm" className="mt-4" onClick={() => setDeliverOpen(true)}>
            <Gift className="mr-2 h-4 w-4" />
            Deliver a Wish
          </Button>
        </motion.div>
      </main>
      <Footer />
      <DeliverWishModal open={deliverOpen} onOpenChange={setDeliverOpen} isPremium={false} />
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
      <CalendarConnectModal open={calendarOpen} onOpenChange={setCalendarOpen} provider="google" />
    </div>
  );
}
