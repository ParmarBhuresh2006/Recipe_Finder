import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Search, Sparkles, Leaf, HeartPulse, Soup, CakeSlice } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";

import catBreakfast from "@/assets/category-breakfast.jpg";
import catLunch from "@/assets/category-lunch.jpg";
import catDinner from "@/assets/category-dinner.jpg";
import catDesserts from "@/assets/category-desserts.jpg";
import lentilSoup from "@/assets/vegan-lentil-soup.jpg";
import shrimpTacos from "@/assets/shrimp-tacos.jpg";
import oatmeal from "@/assets/apple-oatmeal.jpg";
import beefStew from "@/assets/beef-stew.jpg";

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const [activeCategory, setActiveCategory] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async (keyword = "", category = "") => {
    setLoading(true);
    try {
      let query = `/recipes?`;
      if (keyword) query += `keyword=${encodeURIComponent(keyword)}&`;
      if (category) query += `category=${encodeURIComponent(category)}`;
      const { data } = await api.get(query);
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(searchQuery, activeCategory);
    // Only re-run when category changes. Search query uses submit handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { keyword: searchQuery } : {});
    fetchRecipes(searchQuery, activeCategory);
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(prev => prev === categoryName ? "" : categoryName); // Toggle category
  };

  const quickFilters = [
    { icon: Sparkles, label: "Quick Meals" },
    { icon: Leaf, label: "Vegetarian" },
    { icon: HeartPulse, label: "Healthy" },
    { icon: Soup, label: "Soups & Stews" },
    { icon: CakeSlice, label: "Baking" },
  ];

  const categories = [
    { name: "Breakfast", image: catBreakfast },
    { name: "Lunch", image: catLunch },
    { name: "Dinner", image: catDinner },
    { name: "Desserts", image: catDesserts },
    { name: "Vegetarian", image: lentilSoup },
    { name: "Quick Meals", image: shrimpTacos },
    { name: "Baking", image: oatmeal },
    { name: "Soups & Stews", image: beefStew },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <div className="bg-muted rounded-2xl p-10 text-center">
          <h1 className="section-title text-3xl md:text-4xl italic">Discover Your Next Culinary Adventure</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Explore thousands of recipes from around the world. Find exactly what you're craving.
          </p>
          <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes by name, ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {quickFilters.map((f) => (
              <button 
                key={f.label} 
                onClick={() => handleCategoryClick(f.label)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === f.label 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-foreground hover:bg-primary/20"
                }`}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Browse by Category */}
        {!searchQuery && !activeCategory && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <div key={cat.name} className="text-center cursor-pointer group" onClick={() => handleCategoryClick(cat.name)}>
                  <div className={`w-full aspect-square rounded-xl overflow-hidden mb-3 border-4 transition-all ${
                    activeCategory === cat.name ? "border-primary" : "border-transparent group-hover:border-primary/30"
                  }`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className={`font-semibold mb-2 ${activeCategory === cat.name ? "text-primary" : "text-foreground"}`}>{cat.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recipes Results */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
            <h2 className="section-title">
              {searchQuery ? `Results for "${searchQuery}"` : activeCategory ? `${activeCategory} Recipes` : "All Recipes"}
            </h2>
            <span className="text-muted-foreground text-sm">{recipes.length} recipes found</span>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading delicious recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
             <div className="text-center py-12 bg-muted rounded-xl">
                <Soup className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory(""); fetchRecipes("", ""); }}
                  className="btn-outline-golden"
                >
                  Clear all filters
                </button>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((r: any) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
