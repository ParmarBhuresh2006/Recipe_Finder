import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
           <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold font-display text-foreground mb-4">404</h1>
        <p className="text-2xl font-semibold text-muted-foreground mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-md">
          Oops! The recipe you're looking for might have been moved, deleted, or perhaps it never existed in our cookbook.
        </p>
        <Link to="/" className="btn-golden">
          Return to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
