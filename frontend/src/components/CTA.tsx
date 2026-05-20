import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center shadow-glow md:p-20"
        >
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
            >
              <Gift className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Start Celebrating Today
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/90">
              Join thousands of people who never miss a birthday. Add your first birthday and experience the joy of timely celebrations.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-medium"
              >
                <Link to="/add-birthday">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
