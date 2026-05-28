import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Gift,
  Mail,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import type { ApiError } from "@/lib/types";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useToast();

  const { requestCode, verifyCode } = useAuth();

  const [step, setStep] = useState<"email" | "code">("email");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)
      ?.from?.pathname ?? "/dashboard";

  const handleRequestCode = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await requestCode({
        email,
        fullName,
      });

      toast({
        title: "Verification code sent",
        description: `Your code is ${res.code}`,
      });

      setStep("code");
    } catch (err) {
      const apiErr = err as ApiError;

      setError(
        apiErr?.message ??
          "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await verifyCode({
        email,
        code,
        fullName,
      });

      toast({
        title: "Welcome!",
        description: "Successfully signed in.",
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;

      setError(
        apiErr?.message ??
          "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Gift className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              Welcome
            </h1>

            <p className="mt-1 text-muted-foreground">
              Never forget a birthday again
            </p>
          </div>

          <form
            onSubmit={
              step === "email"
                ? handleRequestCode
                : handleVerifyCode
            }
            className="gradient-card space-y-4 rounded-2xl border border-border p-8 shadow-soft"
          >
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />

                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {step === "email" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullname">
                    Full Name
                  </Label>

                  <Input
                    id="fullname"
                    required
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="John Doe"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
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
                  {loading
                    ? "Sending code..."
                    : "Send 5-digit PIN"}
                </Button>
              </>
            )}

            {step === "code" && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="code"
                    className="flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    Verification PIN
                  </Label>

                  <Input
                    id="code"
                    required
                    maxLength={5}
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value)
                    }
                    placeholder="12345"
                    className="h-12 text-center text-2xl tracking-[0.5em]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify PIN"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("email")}
                >
                  Change email
                </Button>
              </>
            )}
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}