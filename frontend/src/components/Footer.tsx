import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src="/Merktag.png" alt="MerkTag" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Never forget a birthday again. Sync, remind, and celebrate with ease.
            </p>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/add-birthday" className="hover:text-primary transition-colors">Add Birthday</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Integrations Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Integrations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Google Calendar</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Microsoft Outlook</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Apple Calendar</span></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links - Centered */}
        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/terms-and-privacy"
              className="hover:text-primary transition-colors"
            >
              Terms & Privacy Policy
            </Link>
            <p>© 2025 MerkTag. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}