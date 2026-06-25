import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Mail, Lock, User, Calendar, AlertCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/lib/types";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("You must accept the Terms of Use and Privacy Policy.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const strongPassword =
      form.password.length >= 8 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password) &&
      /[0-9]/.test(form.password) &&
      /[^A-Za-z0-9]/.test(form.password);

    if (!strongPassword) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    setLoading(true);

    try {
      await signup({
        fullName: form.name,
        phone: form.phone,
        email: form.email,
        birthDate: form.birthDate,
        password: form.password,
      });

      toast({
        title: "Account created! 🎉",
        description: "Welcome to your birthday dashboard.",
      });

      navigate("/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? "Unable to create account. Please try again.");
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
              Start here
            </h1>

            <p className="mt-1 text-muted-foreground">
              Add your birthday and create your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="gradient-card space-y-4 rounded-2xl border border-border p-8 shadow-soft"
          >
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>

              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number
              </Label>

              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="078 123 4567"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>

              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Your Birth Date
              </Label>

              <Input
                id="birthDate"
                type="date"
                required
                value={form.birthDate}
                onChange={(e) =>
                  setForm({ ...form, birthDate: e.target.value })
                }
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Create Password
              </Label>

              <Input
                id="password"
                type="password"
                required
                minLength={8}
                maxLength={128}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Create a strong password"
                className="h-12"
              />

              <p className="text-xs leading-relaxed text-muted-foreground">
                Password must be at least 8 characters and include uppercase, lowercase,
                number, and symbol.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Confirm your password"
                className="h-12"
              />
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />

              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground"
              >
                I have read and agree to the{" "}
                <Link
                  to="/terms-and-privacy"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Terms of Use & Privacy Policy
                </Link>.
              </label>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading || !acceptedTerms}
            >
              {loading ? "Creating…" : "Create Account"}
            </Button>

            <p className="pt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}