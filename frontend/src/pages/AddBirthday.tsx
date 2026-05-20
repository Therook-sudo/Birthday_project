import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Gift, 
  Calendar, 
  User, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter,
  Check,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreateBirthday } from "@/hooks/useBirthdays";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { ApiError, ReligionCategory } from "@/lib/types";

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AddBirthday() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createBirthday = useCreateBirthday();
  const [hideYear, setHideYear] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    religion: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.fullName.trim() || !formData.day || !formData.month) {
      setError("Please fill in name, day and month.");
      return;
    }
    try {
      await createBirthday.mutateAsync({
        fullName: formData.fullName.trim(),
        day: parseInt(formData.day, 10),
        month: parseInt(formData.month, 10),
        year: !hideYear && formData.year ? parseInt(formData.year, 10) : null,
        hideYear,
        religion: (formData.religion || null) as ReligionCategory | null,
        socials: {
          linkedin: formData.linkedin || undefined,
          instagram: formData.instagram || undefined,
          facebook: formData.facebook || undefined,
          twitter: formData.twitter || undefined,
        },
      });
      toast({
        title: "Birthday Added! 🎉",
        description: `${formData.fullName}'s birthday has been saved.`,
      });
      navigate("/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              Add a Birthday
            </h1>
            <p className="text-muted-foreground">
              Enter the details below and never forget this special day
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="gradient-card rounded-2xl border border-border p-8 shadow-soft"
          >
            {/* Full Name */}
            <div className="mb-6">
              <Label htmlFor="fullName" className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-12"
                required
              />
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <Label className="mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Birthday
              </Label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Select
                  value={formData.day}
                  onValueChange={(value) => setFormData({ ...formData, day: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.month}
                  onValueChange={(value) => setFormData({ ...formData, month: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {months.map((month, index) => (
                      <SelectItem key={month} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!hideYear && (
                  <Input
                    placeholder="Year (optional)"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="h-12"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                )}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Switch
                  id="hideYear"
                  checked={hideYear}
                  onCheckedChange={setHideYear}
                />
                <Label htmlFor="hideYear" className="flex cursor-pointer items-center gap-2 text-sm">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  Hide birth year (recommended for privacy)
                </Label>
              </div>
            </div>

            {/* Religion Category */}
            <div className="mb-6">
              <Label className="mb-2 block">Religion Category</Label>
              <Select
                value={formData.religion}
                onValueChange={(value) => setFormData({ ...formData, religion: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="christian">Christian</SelectItem>
                  <SelectItem value="muslim">Muslim</SelectItem>
                  <SelectItem value="none">None / Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                Used to personalize birthday wishes
              </p>
            </div>

            {/* Social Media Handles */}
            <div className="mb-8">
              <Label className="mb-4 block">Social Media Handles (optional)</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="LinkedIn username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="h-12 pl-11"
                  />
                </div>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Instagram username"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="h-12 pl-11"
                  />
                </div>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Facebook username"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="h-12 pl-11"
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="X (Twitter) username"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="h-12 pl-11"
                  />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={createBirthday.isPending}>
              <Check className="mr-2 h-5 w-5" />
              {createBirthday.isPending ? "Saving…" : "Add Birthday"}
            </Button>
          </motion.form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
