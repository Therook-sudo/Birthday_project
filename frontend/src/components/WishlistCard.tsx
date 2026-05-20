import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import type { ID, WishlistItem } from "@/lib/types";

export type { WishlistItem } from "@/lib/types";

interface WishlistCardProps {
  item: WishlistItem;
  editable?: boolean;
  onRemove?: (id: ID) => void;
}

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-accent/20 text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

export function WishlistCard({ item, editable = false, onRemove }: WishlistCardProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/30">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{item.name}</span>
          <Badge variant="outline" className={priorityColors[item.priority]}>
            {item.priority}
          </Badge>
        </div>
        {item.note && (
          <p className="text-sm text-muted-foreground">{item.note}</p>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View item
          </a>
        )}
      </div>
      {editable && onRemove && (
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
