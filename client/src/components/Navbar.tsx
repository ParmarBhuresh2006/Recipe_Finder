import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import api from "../utils/api";

interface NavbarProps {
  variant?: "default" | "admin";
}

const Navbar = ({ variant = "default" }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get user info from Redux
  const { userInfo } = useSelector((state: any) => state.auth);
  const isLoggedIn = !!userInfo;

  const defaultLinks = [
    { to: "/home", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/profile", label: "Profile" },
    { to: "/chefs", label: "Chefs" },
    { to: "/chat", label: "Chat" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/home", label: "Main Site" }
  ];

  const links = userInfo?.role === "admin" && variant === "admin" ? adminLinks : defaultLinks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className={`w-full border-b border-border ${variant === "admin" ? "bg-primary" : "bg-background"}`}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to={isLoggedIn ? "/home" : "/"} className={`text-2xl font-bold font-display ${variant === "admin" ? "text-primary-foreground" : "text-primary"}`}>
          ✳ RecipeFinder
        </Link>

        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  variant === "admin"
                    ? "text-primary-foreground/80 hover:text-primary-foreground"
                    : location.pathname === link.to
                    ? "nav-link-active"
                    : "nav-link"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userInfo?.role === "admin" && variant !== "admin" && (
              <Link to="/admin/dashboard" className="text-sm font-medium text-destructive hover:underline">
                Admin
              </Link>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </form>
          )}

          {!isLoggedIn ? (
            <Link to="/login" className="btn-golden flex items-center gap-1.5 text-sm">
              Login / Register
            </Link>
          ) : (
            <>
              <button onClick={handleLogout} className="btn-golden flex items-center gap-1.5 text-sm">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              <Link to="/profile" className="w-9 h-9 rounded-full bg-golden-light flex items-center justify-center overflow-hidden border border-border">
                {userInfo?.profileImage?.url ? (
                   <img src={userInfo.profileImage.url} alt={userInfo.name} className="w-full h-full object-cover" />
                ) : (
                   <User className="h-5 w-5 text-primary" />
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
