import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function PublicCollectBirthday() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [hideYear, setHideYear] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    day: "",
    month: "",
    year: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });

  const submitBirthday = async () => {
    try {
      setLoading(true);

      await api.post(
        `/public/collect/${token}`,
        {
          fullName: form.fullName,
          phone: form.phone,
          day: Number(form.day),
          month: Number(form.month),
          year: !hideYear && form.year ? Number(form.year) : null,
          hideYear,
          socials: {
            linkedin: form.linkedin || undefined,
            instagram: form.instagram || undefined,
            facebook: form.facebook || undefined,
            twitter: form.twitter || undefined,
          },
        },
        { auth: false }
      );

      toast({
        title: "Birthday submitted",
        description: "The request has been sent successfully.",
      });

      setForm({
        fullName: "",
        phone: "",
        day: "",
        month: "",
        year: "",
        linkedin: "",
        instagram: "",
        facebook: "",
        twitter: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Unable to submit birthday request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <Gift className="mx-auto mb-4 h-10 w-10 text-primary" />

            <h1 className="text-3xl font-bold">Add A Birthday</h1>

            <p className="text-muted-foreground">
              Submit a birthday request.
            </p>
          </div>

          <div>
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="e.g. 078 123 4567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <Label>Day</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={form.day}
                onChange={(e) =>
                  setForm({ ...form, day: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Month</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={form.month}
                onChange={(e) =>
                  setForm({ ...form, month: e.target.value })
                }
              />
            </div>

            {!hideYear && (
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Switch
              id="hideYear"
              checked={hideYear}
              onCheckedChange={setHideYear}
            />

            <Label
              htmlFor="hideYear"
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              Hide birth year (recommended for privacy)
            </Label>
          </div>

          <Button
            onClick={submitBirthday}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Submitting..." : "Submit Birthday"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}