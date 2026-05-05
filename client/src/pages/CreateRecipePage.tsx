import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { Utensils, Plus, Trash2, Upload, ChefHat } from "lucide-react";

const CreateRecipePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [difficulty, setDifficulty] = useState("Medium");
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [image, setImage] = useState<File | null>(null);
  
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: "" }]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "chef") {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleAddIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }]);
  const handleRemoveIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const handleIngredientChange = (index: number, field: "name" | "amount", value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => setSteps([...steps, { stepNumber: steps.length + 1, instruction: "" }]);
  const handleRemoveStep = (index: number) => {
      const newSteps = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 }));
      setSteps(newSteps);
  };
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].instruction = value;
    setSteps(newSteps);
  };

  const uploadFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("difficulty", difficulty);
      formData.append("prepTime", prepTime.toString());
      formData.append("cookTime", cookTime.toString());
      formData.append("servings", servings.toString());
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", JSON.stringify(steps));
      if (image) formData.append("image", image);

      await api.post("/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert("Recipe created successfully!");
      navigate("/menu");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo || userInfo.role !== "chef") return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-golden-light mx-auto mb-4 flex items-center justify-center">
               <Utensils className="h-8 w-8 text-primary" />
            </div>
            <h1 className="section-title">Create New Recipe</h1>
            <p className="text-muted-foreground mt-2">Share your culinary masterpiece with the RecipeFinder community.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="card-elevated">
              <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" /> Basic Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Recipe Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Classic Margherita Pizza" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Short Description</label>
                  <textarea 
                    rows={3} 
                    placeholder="Briefly describe the taste and history..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Quick Meals">Quick Meals</option>
                      <option value="Baking">Baking</option>
                      <option value="Soups & Stews">Soups & Stews</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Difficulty</label>
                    <select 
                      value={difficulty} 
                      onChange={(e) => setDifficulty(e.target.value)} 
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Prep (min)</label>
                    <input 
                      type="number" 
                      value={prepTime} 
                      onChange={(e) => setPrepTime(Number(e.target.value))} 
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Cook (min)</label>
                    <input 
                      type="number" 
                      value={cookTime} 
                      onChange={(e) => setCookTime(Number(e.target.value))} 
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Servings</label>
                    <input 
                      type="number" 
                      value={servings} 
                      onChange={(e) => setServings(Number(e.target.value))} 
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Upload Recipe Image</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={uploadFileHandler} 
                        accept="image/*" 
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">Ingredients</h2>
                <button type="button" onClick={handleAddIngredient} className="btn-outline-golden text-xs px-3 py-1.5 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Ingredient
                </button>
              </div>
              
              <div className="space-y-3">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1/3">
                      <input 
                        type="text" 
                        placeholder="Amount (e.g. 2 cups)" 
                        value={ing.amount} 
                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)} 
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                        required 
                      />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="Ingredient name (e.g. Flour)" 
                        value={ing.name} 
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)} 
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                        required 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveIngredient(index)} 
                      disabled={ingredients.length === 1}
                      className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">Cooking Instructions</h2>
                <button type="button" onClick={handleAddStep} className="btn-outline-golden text-xs px-3 py-1.5 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Step
                </button>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 mt-1">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <textarea 
                        rows={2} 
                        placeholder={`Describe step ${step.stepNumber}...`} 
                        value={step.instruction} 
                        onChange={(e) => handleStepChange(index, e.target.value)} 
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" 
                        required 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveStep(index)} 
                      disabled={steps.length === 1}
                      className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors mt-1 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-golden flex items-center gap-2 px-8 py-3 text-lg"
              >
                {loading ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> Publishing...</>
                ) : (
                  <><Upload className="h-5 w-5" /> Publish Recipe</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateRecipePage;
