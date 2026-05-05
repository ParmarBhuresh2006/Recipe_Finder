import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Utensils, Star, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const ChefsListPage = () => {
  const [chefs, setChefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const { data } = await api.get("/users/chefs");
        setChefs(data);
      } catch (error) {
        console.error("Error fetching chefs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 space-y-10">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-16 h-16 rounded-full bg-golden-light mx-auto mb-4 flex items-center justify-center">
             <ChefHat className="h-8 w-8 text-primary" />
          </div>
          <h1 className="section-title text-4xl mb-4 italic">Meet Our Chefs</h1>
          <p className="text-muted-foreground text-lg">
            Discover the brilliant culinary minds behind your favorite recipes. Follow them to stay updated on their latest creations.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
           </div>
        ) : chefs.length === 0 ? (
           <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border max-w-2xl mx-auto">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No chefs joined yet</h3>
              <p className="text-muted-foreground mb-6">Are you a chef? Create an account and be the first!</p>
              <Link to="/register" className="btn-golden">Join as a Chef</Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {chefs.map((chef) => (
              <div key={chef._id} className="card-elevated flex flex-col items-center text-center p-6 group hover:-translate-y-1 duration-300">
                <div className="w-32 h-32 rounded-full bg-muted mb-5 flex items-center justify-center overflow-hidden border-4 border-background shadow-md group-hover:border-primary/20 transition-colors relative z-10">
                  {chef.profileImage?.url ? (
                     <img src={chef.profileImage.url} alt={chef.name} className="w-full h-full object-cover" />
                  ) : (
                     <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold font-display text-foreground mb-1 line-clamp-1">{chef.name}</h3>
                
                <div className="flex items-center gap-1.5 text-primary text-sm font-medium mb-3 bg-primary/10 px-3 py-1 rounded-full">
                  <Utensils className="h-3.5 w-3.5" />
                  <span>{chef.specialization || "Master Chef"}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
                  {chef.bio || "This chef loves cooking but hasn't written a bio yet! Check out their recipes."}
                </p>
                
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <span className="text-xs font-bold ml-1">5.0</span>
                </div>
                
                <Link to={`/chefs/${chef._id}`} className="btn-outline-golden text-sm px-6 py-2 w-full mt-auto">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ChefsListPage;
