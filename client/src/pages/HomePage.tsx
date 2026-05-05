import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Link } from "react-router-dom";
import { BookOpen, ChefHat, Heart, LayoutList, Utensils, BookMarked, Users, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const HomePage = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/recipes?limit=4');
        // If data is array take first 4
        setTrendingRecipes(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error("Error fetching trending recipes", err);
      }
    };
    fetchTrending();
  }, []);

  const stats = [
    { icon: BookOpen, value: "124", label: "Saved Recipes", link: "View recipes" },
    { icon: ChefHat, value: "18", label: "Favorite Chefs", link: "View chefs" },
    { icon: Heart, value: "45", label: "Liked dishes", link: "View dishes" },
    { icon: LayoutList, value: "7", label: "Meal Plans", link: "View plans" },
  ];

  const quickAccess = [
    { icon: Utensils, title: "Explore Menu", desc: "Browse recipes by categories and cuisines.", to: "/menu" },
    { icon: BookMarked, title: "My Saved Recipes", desc: "Access all your saved and favorited recipes.", to: "/profile" },
    { icon: Users, title: "Find Chefs", desc: "Discover and follow your favorite culinary experts.", to: "/chefs" },
    { icon: MessageCircle, title: "Chat with AI Assistant", desc: "Get instant answers to your cooking questions.", to: "/chat" },
  ];

  const recentSearches = ["Pasta recipes", "Quick dinner", "Vegan meals", "Desserts"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Welcome Banner */}
        <div className="bg-muted rounded-2xl p-8 flex items-center justify-between">
          <div>
            <h1 className="section-title">Hello, {userInfo?.name || 'Chef'}!</h1>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Welcome back to your culinary journey. Discover new flavors, save your favorites, and cook like a pro.
            </p>
            <Link to="/profile" className="inline-block mt-4 font-semibold text-foreground underline underline-offset-4">
              View your dashboard
            </Link>
          </div>
          <div className="hidden md:block text-center">
            <div className="w-20 h-20 rounded-full bg-golden-light mx-auto mb-2 flex items-center justify-center overflow-hidden border border-border">
              {userInfo?.profileImage?.url ? (
                <img src={userInfo.profileImage.url} alt={userInfo.name} className="w-full h-full object-cover" />
              ) : (
                <ChefHat className="h-10 w-10 text-primary" />
              )}
            </div>
            <p className="font-bold">{userInfo?.name || 'User'}</p>
            <p className="text-sm text-muted-foreground capitalize">{userInfo?.role || 'Foodie'}</p>
            <Link to="/profile" className="text-primary text-sm hover:underline">View Profile</Link>
          </div>
        </div>

        {/* Culinary Overview */}
        <section>
          <h2 className="section-title mb-6">Your Culinary Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <stat.icon className="h-6 w-6 text-foreground mb-3" />
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <span className="text-primary text-sm mt-2 inline-block hover:underline cursor-pointer">{stat.link}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Recipes */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title">Trending Recipes for You</h2>
            <Link to="/menu" className="text-primary hover:underline font-medium text-sm">View all recipes</Link>
          </div>
          {trendingRecipes.length === 0 ? (
             <p className="text-muted-foreground">Loading trending recipes...</p>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {trendingRecipes.map((recipe: any) => (
                 <RecipeCard key={recipe._id} recipe={recipe} />
               ))}
             </div>
          )}
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="section-title mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccess.map((item) => (
              <Link key={item.title} to={item.to} className="stat-card hover:shadow-md transition-shadow">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                <span className="text-primary text-sm font-medium hover:underline">Go now</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Searches */}
        <section>
          <h2 className="section-title mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {recentSearches.map((s) => (
              <Link key={s} to={`/menu?keyword=${encodeURIComponent(s)}`} className="golden-badge cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
