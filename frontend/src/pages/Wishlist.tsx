import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { WishlistCard } from "@/components/WishlistCard";
import { Plus, Share2, Check, Gift, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAddWishlistItem,
  useRemoveWishlistItem,
  useUserWishlist,
} from "@/hooks/useWishlist";
import type { ID, WishlistPriority } from "@/lib/types";

export default function Wishlist() {
  const { userId } = useParams<{ userId?: string }>();
  const isOwner = !userId;
  const wishlistQuery = useUserWishlist(userId);
  const addMut = useAddWishlistItem();
  const removeMut = useRemoveWishlistItem();

  const [addOpen, setAddOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    link: "",
    note: "",
    priority: "Medium" as WishlistPriority,
  });
  const { toast } = useToast();

  const items = wishlistQuery.data ?? [];

  const handleAdd = async () => {
    if (!newItem.name.trim()) return;
    try {
      await addMut.mutateAsync({
        name: newItem.name.trim(),
        link: newItem.link || undefined,
        note: newItem.note || undefined,
        priority: newItem.priority,
      });
      setNewItem({ name: "", link: "", note: "", priority: "Medium" });
      setAddOpen(false);
      toast({ title: "Item added to your wishlist!" });
    } catch {
      toast({ title: "Could not add item", variant: "destructive" });
    }
  };

  const handleRemove = async (id: ID) => {
    try {
      await removeMut.mutateAsync(id);
      toast({ title: "Item removed from wishlist" });
    } catch {
      toast({ title: "Could not remove item", variant: "destructive" });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Wishlist link copied!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {isOwner ? "My Wishlist" : `${userId}'s Wishlist`}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {isOwner
                ? "Manage your wishlist items and share with friends"
                : "View what they'd love to receive"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Share Wishlist"}
            </Button>
            {isOwner && (
              <Button variant="hero" size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {wishlistQuery.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : wishlistQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Could not load wishlist.</AlertDescription>
            </Alert>
          ) : items.length === 0 ? (
            <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-soft">
              <Gift className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                {isOwner ? "Your wishlist is empty" : "Nothing here yet"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {isOwner ? "Add items you'd love to receive!" : "Check back later."}
              </p>
              {isOwner && (
                <Button variant="hero" size="sm" className="mt-4" onClick={() => setAddOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="gradient-card rounded-xl border border-border p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </h2>
                <div className="flex gap-2">
                  {(["High", "Medium", "Low"] as const).map((p) => {
                    const count = items.filter((i) => i.priority === p).length;
                    return count > 0 ? (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}: {count}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    editable={isOwner}
                    onRemove={isOwner ? handleRemove : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Wishlist Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Item Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. AirPods Pro"
                value={newItem.name}
                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Link (optional)</Label>
              <Input
                placeholder="https://store.com/item"
                value={newItem.link}
                onChange={(e) => setNewItem((p) => ({ ...p, link: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Size, color, preference..."
                value={newItem.note}
                onChange={(e) => setNewItem((p) => ({ ...p, note: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newItem.priority}
                onValueChange={(v) => setNewItem((p) => ({ ...p, priority: v as WishlistPriority }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              variant="hero"
              onClick={handleAdd}
              disabled={!newItem.name.trim() || addMut.isPending}
            >
              {addMut.isPending ? "Adding…" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// WishlistItem type now lives in @/lib/types — keep this re-export for older imports.
export type { WishlistItem } from "@/lib/types";
