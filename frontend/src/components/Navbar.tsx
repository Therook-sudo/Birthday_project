import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/add-birthday", label: "Add Birthday" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/premium", label: "Premium" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [authChoiceOpen, setAuthChoiceOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const openAuthChoice = () => {
    setIsOpen(false);
    setAuthChoiceOpen(true);
  };

  const goToSignup = () => {
    setAuthChoiceOpen(false);
    navigate("/signup");
  };

  const goToLogin = () => {
    setAuthChoiceOpen(false);
    navigate("/login");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg"
      >
        <nav className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/Merktag.png"
              alt="MerkTag"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && <NotificationCenter />}

            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={openAuthChoice}>
                  Sign In
                </Button>

                <Button variant="hero" size="sm" onClick={openAuthChoice}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden"
          >
            <div className="container flex flex-col gap-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <NotificationCenter />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={openAuthChoice}>
                      Sign In
                    </Button>

                    <Button variant="hero" size="sm" onClick={openAuthChoice}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      <Dialog open={authChoiceOpen} onOpenChange={setAuthChoiceOpen}>
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
    </>
  );
}