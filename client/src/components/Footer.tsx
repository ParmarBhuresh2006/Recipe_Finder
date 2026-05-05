import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-bg py-8">
        <div className="container mx-auto px-4 flex justify-end gap-8">
          <span className="text-primary-foreground font-medium cursor-pointer hover:underline">Recipe Finder</span>
          <span className="text-primary-foreground font-medium cursor-pointer hover:underline">Resources</span>
          <span className="text-primary-foreground font-medium cursor-pointer hover:underline">Connect</span>
        </div>
      </div>
      <div className="bg-background py-6 border-t border-border">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2026 Recipe Finder. All rights reserved.</p>
          <div className="flex gap-4">
            <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
