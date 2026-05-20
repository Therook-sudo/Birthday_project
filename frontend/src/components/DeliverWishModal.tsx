import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Lock } from "lucide-react";
import { useDeliverWish } from "@/hooks/usePremium";
import type { ApiError, DeliveryMethod } from "@/lib/types";

const contacts = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Williams",
  "James Brown",
  "Anna Davis",
];

interface DeliverWishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPremium: boolean;
}

export function DeliverWishModal({ open, onOpenChange, isPremium }: DeliverWishModalProps) {
  const deliver = useDeliverWish();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    person: "",
    method: "" as DeliveryMethod | "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    tone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.person || !form.method || !form.preferredDate || !form.preferredTime || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      await deliver.mutateAsync({
        person: form.person,
        method: form.method as DeliveryMethod,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message,
        tone: form.tone || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? "Could not submit your request.");
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError(null);
    setForm({ person: "", method: "", preferredDate: "", preferredTime: "", message: "", tone: "" });
    onOpenChange(false);
  };

  if (!isPremium) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Premium Feature
            </DialogTitle>
            <DialogDescription>
              Upgrade to Premium to use "Deliver a Wish" and let us personally deliver your message via call, WhatsApp, or video.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="mb-3 text-sm text-foreground">Unlock personalized wish delivery starting at $4.99/wish</p>
            <Button variant="hero">Upgrade to Premium</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle>Request Submitted!</DialogTitle>
            <DialogDescription>
              Your wish delivery request has been received. We'll reach out to confirm the details and schedule the delivery.
            </DialogDescription>
            <Button onClick={handleClose} variant="hero">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Deliver a Wish</DialogTitle>
          <DialogDescription>
            We'll personally deliver your heartfelt message to your loved one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label>Select Person</Label>
            <Select value={form.person} onValueChange={(v) => setForm((f) => ({ ...f, person: v }))}>
              <SelectTrigger><SelectValue placeholder="Choose a contact" /></SelectTrigger>
              <SelectContent>
                {contacts.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <Select value={form.method} onValueChange={(v) => setForm((f) => ({ ...f, method: v as DeliveryMethod }))}>
              <SelectTrigger><SelectValue placeholder="Choose method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Phone Call</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Voice Note</SelectItem>
                <SelectItem value="video">Video Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preferred Date</Label>
              <Input
                type="date"
                value={form.preferredDate}
                onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Time</Label>
              <Input
                type="time"
                value={form.preferredTime}
                onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Message <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Write your heartfelt message..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone (optional)</Label>
            <Select value={form.tone} onValueChange={(v) => setForm((f) => ({ ...f, tone: v }))}>
              <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="faith">Faith-based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={deliver.isPending}>
              {deliver.isPending ? "Submitting…" : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
