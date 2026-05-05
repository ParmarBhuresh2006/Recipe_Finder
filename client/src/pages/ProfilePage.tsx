import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { User, BookmarkCheck, Star, Eye, Settings, LogOut, Utensils } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"saved" | "mine" | "settings">("saved");
  
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    setName(userInfo.name);
    setEmail(userInfo.email);
    setBio(userInfo.bio || "");
    fetchUserData();
  }, [userInfo, navigate]);

  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/users/profile");
      setSavedRecipes(data.savedRecipes || []);
      
      if(userInfo.role === "chef") {
         const { data: myRecs } = await api.get(`/recipes`); 
         if(Array.isArray(myRecs)) {
             setMyRecipes(myRecs.filter(r => r.chef?._id === userInfo._id || r.chef === userInfo._id));
         }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("_id", userInfo._id);
      if (name) formData.append("name", name);
      if (email) formData.append("email", email);
      if (password) formData.append("password", password);
      if (bio) formData.append("bio", bio);
      if (profileImage) formData.append("profileImage", profileImage);

      const { data } = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(setCredentials(data));
      alert("Profile Updated Successfully");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Error updating profile");
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

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Profile Header */}
        <div className="card-elevated flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-32 h-32 rounded-full bg-muted border-4 border-background shadow-lg flex items-center justify-center relative z-10 overflow-hidden shrink-0">
            {userInfo.profileImage?.url ? (
               <img src={userInfo.profileImage.url} alt={userInfo.name} className="w-full h-full object-cover" />
            ) : (
               <User className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          
          <div className="text-center md:text-left relative z-10 flex-1">
            <h1 className="text-3xl font-bold font-display">{userInfo.name}</h1>
            <p className="text-primary font-medium mt-1 capitalize">{userInfo.role}</p>
            <p className="text-muted-foreground mt-2 max-w-lg">{userInfo.bio || "No bio added yet. Tell people about your culinary journey!"}</p>
          </div>
          
          <div className="relative z-10 flex flex-col gap-3">
             <button onClick={() => setActiveTab("settings")} className="btn-outline-golden flex items-center gap-2 justify-center">
               <Settings className="h-4 w-4" /> Edit Profile
             </button>
             <button onClick={handleLogout} className="text-destructive text-sm font-medium hover:underline flex items-center justify-center gap-2">
               <LogOut className="h-4 w-4" /> Log Out
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b border-border pb-4">
          <button 
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "saved" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            <BookmarkCheck className="h-4 w-4" /> Saved Recipes ({savedRecipes.length})
          </button>
          
          {userInfo.role === "chef" && (
            <button 
              onClick={() => setActiveTab("mine")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "mine" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              <Utensils className="h-4 w-4" /> My Recipes ({myRecipes.length})
            </button>
          )}
          
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "saved" && (
          <section>
            {savedRecipes.length === 0 ? (
               <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">No saved recipes yet</h3>
                  <p className="text-muted-foreground mb-4">Start exploring and save your favorite recipes here.</p>
                  <button onClick={() => navigate("/menu")} className="btn-golden">Explore Menu</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {savedRecipes.map((r: any) => (
                   <RecipeCard key={r._id} recipe={r} />
                 ))}
               </div>
            )}
          </section>
        )}

        {activeTab === "mine" && userInfo.role === "chef" && (
          <section>
            {myRecipes.length === 0 ? (
               <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">You haven't posted any recipes</h3>
                  <p className="text-muted-foreground mb-4">Share your culinary creations with the world.</p>
                  <button onClick={() => navigate("/create-recipe")} className="btn-golden">Create Recipe</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {myRecipes.map((r: any) => (
                   <RecipeCard key={r._id} recipe={r} />
                 ))}
               </div>
            )}
          </section>
        )}

        {activeTab === "settings" && (
          <section className="max-w-2xl mx-auto">
            <div className="card-elevated">
              <h2 className="section-title mb-6">Profile Settings</h2>
              <form onSubmit={submitHandler} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Profile Picture</label>
                  <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files ? e.target.files[0] : null)}
                    accept="image/*"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your culinary interests..."
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold text-foreground mb-4">Change Password (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-golden">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
