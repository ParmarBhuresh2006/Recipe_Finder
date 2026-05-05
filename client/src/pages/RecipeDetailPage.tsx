import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Utensils, Users, Heart, Star, UserCircle, Trash2 } from "lucide-react";
import api from "../utils/api";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!id) return;
    const fetchRecipeData = async () => {
      try {
        const { data: recipeData } = await api.get(`/recipes/${id}`);
        setRecipe(recipeData);
        
        const { data: commentsData } = await api.get(`/social/recipes/${id}/comments`);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching recipe", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeData();
  }, [id]);

  const likeHandler = async () => {
    if (!userInfo) return navigate("/login");
    try {
      const { data } = await api.post(`/social/recipes/${id}/like`);
      setRecipe({ ...recipe, likesCount: data.likesCount });
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(`/social/recipes/${id}/comments`, { text: commentText });
      setComments([data, ...comments]);
      setCommentText("");
      setRecipe({ ...recipe, commentsCount: (recipe.commentsCount || 0) + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecipeHandler = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await api.delete(`/recipes/${id}`);
        navigate("/menu");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
       <Navbar />
       <div className="flex-1 flex items-center justify-center">
         <p className="text-muted-foreground animate-pulse">Loading recipe details...</p>
       </div>
       <Footer />
    </div>
  );

  if (!recipe) return (
    <div className="min-h-screen bg-background flex flex-col">
       <Navbar />
       <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
         <Utensils className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
         <h2 className="text-2xl font-bold mb-2">Recipe Not Found</h2>
         <p className="text-muted-foreground mb-6">We couldn't find the recipe you were looking for.</p>
         <Link to="/menu" className="btn-golden">Back to Menu</Link>
       </div>
       <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 shadow-lg">
          <img 
            src={recipe.image?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop"} 
            alt={recipe.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent flex flex-col items-center justify-end pb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-display text-background text-center px-4">{recipe.title}</h1>
            <button onClick={likeHandler} className={`mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all ${isLiked ? 'bg-destructive text-destructive-foreground' : 'bg-background/20 text-background backdrop-blur-sm border border-background/30 hover:bg-background/40'}`}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} /> 
              {isLiked ? 'Saved to Favorites' : 'Save Recipe'} ({recipe.likesCount || 0})
            </button>
          </div>
        </div>

        {/* Quick Info & Actions */}
        <div className="card-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" /> 
              <div>
                 <span className="text-sm block font-bold text-foreground">Prep Time</span>
                 <span className="text-sm">{recipe.prepTime} mins</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground border-l border-border pl-6">
              <Utensils className="h-5 w-5 text-primary" /> 
              <div>
                 <span className="text-sm block font-bold text-foreground">Cook Time</span>
                 <span className="text-sm">{recipe.cookTime} mins</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground border-l border-border pl-6">
              <Users className="h-5 w-5 text-primary" /> 
              <div>
                 <span className="text-sm block font-bold text-foreground">Difficulty</span>
                 <span className="text-sm capitalize">{recipe.difficulty}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
            <Link to={`/chefs/${recipe.chef?._id}`} className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-golden-light flex items-center justify-center overflow-hidden border border-border shrink-0">
                {recipe.chef?.profileImage?.url ? (
                  <img src={recipe.chef.profileImage.url} alt={recipe.chef.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recipe by</p>
                <p className="text-sm font-bold text-foreground">{recipe.chef?.name || "Unknown Chef"}</p>
              </div>
            </Link>

            {userInfo && (userInfo.role === 'admin' || userInfo._id === recipe.chef?._id) && (
              <button onClick={deleteRecipeHandler} className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors ml-auto" title="Delete Recipe">
                 <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-1">
          {recipe.description}
        </p>

        {/* Ingredients & Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="card-elevated bg-golden-light/30 border-primary/20">
              <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                 <Utensils className="h-5 w-5 text-primary" /> Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground py-2 border-b border-border/50 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold">{item.amount}</span>{" "}
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-elevated">
              <h2 className="text-xl font-bold font-display mb-6">Instructions</h2>
              <div className="space-y-8">
                {recipe.steps?.sort((a:any,b:any)=>a.stepNumber - b.stepNumber).map((step: any, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                         {step.stepNumber}
                       </div>
                       {i !== recipe.steps.length - 1 && (
                         <div className="w-px h-full bg-border mt-2" />
                       )}
                    </div>
                    <div className="pt-1 pb-4">
                      <p className="text-foreground leading-relaxed">{step.instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="card-elevated mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display">Comments ({comments.length})</h2>
            <div className="flex items-center gap-1">
               <Star className="h-5 w-5 fill-primary text-primary" />
               <span className="font-bold">{recipe.rating || "4.8"}</span>
            </div>
          </div>
          
          {userInfo ? (
            <form onSubmit={submitComment} className="mb-8 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                {userInfo.profileImage?.url ? (
                   <img src={userInfo.profileImage.url} alt="You" className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                     {userInfo.name?.charAt(0)}
                   </div>
                )}
              </div>
              <div className="flex-1">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this recipe..."
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  rows={3}
                  required
                />
                <div className="flex justify-end mt-2">
                   <button type="submit" className="btn-golden text-sm px-6 py-2">Post Comment</button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-muted rounded-xl p-6 text-center mb-8">
               <p className="text-muted-foreground mb-3">Please log in to join the conversation.</p>
               <Link to="/login" className="btn-golden text-sm px-6 py-2">Log In</Link>
            </div>
          )}

          <div className="space-y-6">
             {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to review!</p>
             ) : (
                comments.map((comment: any) => (
                  <div key={comment._id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                      {comment.user?.profileImage?.url ? (
                         <img src={comment.user.profileImage.url} alt={comment.user.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-secondary text-foreground font-bold">
                           {comment.user?.name?.charAt(0) || "U"}
                         </div>
                      )}
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-2xl rounded-tl-sm p-4">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-foreground">{comment.user?.name || "Unknown User"}</span>
                          <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                       </div>
                       <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;
