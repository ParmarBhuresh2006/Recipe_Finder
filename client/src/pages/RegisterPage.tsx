import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import api from "../utils/api";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      dispatch(setCredentials(data));
      navigate("/home");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-bg p-4">
      <div className="bg-card rounded-2xl shadow-lg max-w-4xl w-full flex overflow-hidden">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-2xl font-bold text-primary font-display mb-1">✳ RecipeFinder</h1>
          <h2 className="section-title mt-4">Join Us!</h2>
          <p className="text-muted-foreground mb-6">Create your account</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Account Type</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                >
                  <option value="user">Food Lover</option>
                  <option value="chef">Chef</option>
                </select>
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <button type="submit" className="btn-golden w-full py-3 text-base mt-2">
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
          </p>
        </div>

        {/* Right - Image */}
        <div className="hidden md:block w-1/2 bg-golden-light p-8">
          <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" alt="Food" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
