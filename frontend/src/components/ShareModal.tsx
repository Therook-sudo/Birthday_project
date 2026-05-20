import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Mail, MessageCircle, Linkedin, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  shareUrl?: string;
}

export function ShareModal({ open, onOpenChange, shareUrl }: ShareModalProps) {
  const url = shareUrl ?? `${window.location.origin}/u/me/collect`;
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ title: "Link copied!" });
  };

  const channels = [
    { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(url)}` },
    { icon: Mail, label: "Email", href: `mailto:?subject=Add your birthday&body=${encodeURIComponent(url)}` },
    { icon: Linkedin, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { icon: Facebook, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your collection link</DialogTitle>
          <DialogDescription>
            Friends and family can submit their birthdays through this link.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input value={url} readOnly className="h-11" />
          <Button onClick={copy} variant="hero" className="h-11">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <c.icon className="h-5 w-5" />
              {c.label}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
