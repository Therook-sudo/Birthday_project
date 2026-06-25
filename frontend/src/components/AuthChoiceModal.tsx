import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface AuthChoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthChoiceModal({
  open,
  onOpenChange,
}: AuthChoiceModalProps) {
  const navigate = useNavigate();

  const goToSignup = () => {
    onOpenChange(false);
    navigate("/signup");
  };

  const goToLogin = () => {
    onOpenChange(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Gift className="h-7 w-7 text-primary" />
          </div>

          <DialogTitle className="text-2xl">
            Is this your first time using merktag?
          </DialogTitle>

          <DialogDescription>
            Choose the right option so we can take you to the correct place.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="hero" size="lg" onClick={goToSignup}>
            Yes
          </Button>

          <Button variant="outline" size="lg" onClick={goToLogin}>
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}