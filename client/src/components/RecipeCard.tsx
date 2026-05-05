import { Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  image?: string;
  title?: string;
  reviews?: number;
  time?: string;
  rating?: number;
  // Support for actual backend recipe object
  recipe?: any;
  _id?: string;
}

const RecipeCard = ({ 
  image, 
  title, 
  reviews = 0, 
  time, 
  rating = 4,
  recipe 
}: RecipeCardProps) => {
  
  // Resolve data source (either props or recipe object)
  const displayTitle = recipe?.title || title || "Untitled Recipe";
  const displayImage = recipe?.image?.url || image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop";
  const displayTime = recipe ? `${recipe.prepTime + recipe.cookTime} mins` : (time || "30 mins");
  const displayReviews = recipe?.commentsCount || reviews;
  const displayRating = recipe?.rating || rating;
  const recipeId = recipe?._id || "1";

  return (
    <div className="card-elevated flex flex-col items-center text-center p-4">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-4 shadow-sm">
        <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover" loading="lazy" width={160} height={160} />
      </div>
      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{displayTitle}</h3>
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i < displayRating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({displayReviews} Reviews)</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
        <Clock className="h-3.5 w-3.5" />
        {displayTime}
      </div>
      <Link to={`/recipes/${recipeId}`} className="btn-golden text-sm px-5 py-2 mt-auto">
        View Recipe
      </Link>
    </div>
  );
};

export default RecipeCard;
