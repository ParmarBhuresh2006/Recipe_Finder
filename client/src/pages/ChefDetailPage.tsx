import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { User, Star, Utensils } from "lucide-react";
import api from "../utils/api";

const ChefDetailPage = () => {
  const { id } = useParams();
  const [chef, setChef] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchChefData = async () => {
      try {
        const { data: chefData } = await api.get(`/users/${id}`);
        setChef(chefData);
        
        // Fetch recipes by this chef
        // Note: The backend needs to support this query or we fetch all and filter
        const { data: recipesData } = await api.get(`/recipes`);
        const chefRecipes = Array.isArray(recipesData) 
          ? recipesData.filter(r => r.chef?._id === id || r.chef === id)
          : [];
        setRecipes(chefRecipes);
      } catch (error) {
        console.error("Error fetching chef details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChefData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
       <Navbar />
       <div className="flex-1 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
       </div>
       <Footer />
    </div>
  );

  if (!chef) return (
    <div className="min-h-screen bg-background flex flex-col">
       <Navbar />
       <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
         <User className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
         <h2 className="text-2xl font-bold mb-2">Chef Not Found</h2>
         <p className="text-muted-foreground mb-6">We couldn't find the chef you were looking for.</p>
         <Link to="/chefs" className="btn-golden">Back to Chefs</Link>
       </div>
       <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Chef Header */}
        <div className="card-elevated relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 via-golden-light to-transparent" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 pt-8">
            <div className="w-32 h-32 rounded-full bg-muted border-4 border-background shadow-lg flex items-center justify-center overflow-hidden shrink-0">
              {chef.profileImage?.url ? (
                 <img src={chef.profileImage.url} alt={chef.name} className="w-full h-full object-cover" />
              ) : (
                 <User className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold font-display text-foreground">{chef.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5" />
                  {chef.specialization || "Master Chef"}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  5.0 <span className="text-muted-foreground font-normal">(120 Reviews)</span>
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1 before:content-['•'] before:mr-1">
                  {recipes.length} Recipes
                </span>
              </div>
              
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {chef.bio || "This chef loves cooking but hasn't written a bio yet! Check out their delicious recipes below."}
              </p>
            </div>
            
            <div className="shrink-0">
              <button className="btn-golden w-full md:w-auto">Follow Chef</button>
            </div>
          </div>
        </div>

        {/* Signature Recipes */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="section-title">Recipes by {chef.name}</h2>
          </div>
          
          {recipes.length === 0 ? (
             <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border max-w-2xl mx-auto">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">No recipes yet</h3>
                <p className="text-muted-foreground">This chef hasn't published any recipes.</p>
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

export default ChefDetailPage;
