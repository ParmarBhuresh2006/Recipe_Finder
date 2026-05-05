import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import api from "../utils/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      dispatch(setCredentials(data));
      navigate("/home");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-bg p-4">
      <div className="bg-card rounded-2xl shadow-lg max-w-4xl w-full flex overflow-hidden">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-2xl font-bold text-primary font-display mb-1">✳ RecipeFinder</h1>
          <h2 className="section-title mt-4">Welcome Back!</h2>
          <p className="text-muted-foreground mb-6">Log in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-primary text-sm hover:underline">Forgot password?</a>
            </div>

            <button type="submit" className="btn-golden w-full py-3 text-base">
              Log In
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium tracking-wider">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            <button className="w-full border border-border rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* Right - Image */}
        <div className="hidden md:block w-1/2 bg-golden-light p-8">
          <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800&q=80" alt="Kitchen" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
