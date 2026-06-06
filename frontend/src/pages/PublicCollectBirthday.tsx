import { useState } from "react";
import { useParams } from "react-router-dom";
import { Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function PublicCollectBirthday() {
  const { token } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
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

await api.post(`/public/collect/${token}`, {    
        fullName: form.fullName,
        day: Number(form.day),
        month: Number(form.month),
        year: form.year ? Number(form.year) : null,
        hideYear: !form.year,
        socials: {
          linkedin: form.linkedin || undefined,
          instagram: form.instagram || undefined,
          facebook: form.facebook || undefined,
          twitter: form.twitter || undefined,
        },
      });

      toast({
        title: "Birthday submitted",
        description: "The request has been sent successfully.",
      });

      setForm({
        fullName: "",
        day: "",
        month: "",
        year: "",
        linkedin: "",
        instagram: "",
        facebook: "",
        twitter: "",
      });
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

            <h1 className="text-3xl font-bold">
              Add A Birthday
            </h1>

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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Day</Label>
              <Input
                type="number"
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
                value={form.month}
                onChange={(e) =>
                  setForm({ ...form, month: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Year</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: e.target.value })
                }
              />
            </div>
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