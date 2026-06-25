import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import type { ApiError } from "@/lib/types";

export default function SecuritySettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.setSecurityQuestion({
        securityQuestion,
        securityAnswer,
      });

      await refreshUser();

      toast({
        title: "Security question saved",
        description: "Your recovery question has been updated.",
      });

      navigate("/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? "Unable to save security question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold">
              Security & Recovery
            </h1>

            <p className="mt-2 text-muted-foreground">
              Set a recovery question to help reset your password securely.
            </p>
          </div>

          <form
            onSubmit={handleSave}
            className="gradient-card space-y-5 rounded-2xl border border-border p-8 shadow-soft"
          >
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="securityQuestion">
                Security Question
              </Label>

              <Input
                id="securityQuestion"
                required
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                placeholder="Example: What is your first school name?"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityAnswer">
                Security Answer
              </Label>

              <Input
                id="securityAnswer"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Your answer"
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Security Question"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}