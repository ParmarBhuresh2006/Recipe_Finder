import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ChefHat, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Index = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-golden/10 text-golden-dark text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Culinary Excellence
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-display leading-[1.1]">
                Master Your Kitchen with <span className="text-primary italic">RecipeFinder</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Connect with world-class chefs, discover extraordinary recipes, and let our AI assistant guide you through your culinary journey.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  Start Cooking <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/menu" className="w-full sm:w-auto px-8 py-4 bg-background text-foreground border-2 border-border rounded-full font-semibold text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center">
                  Explore Menu
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-golden-light rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our platform is designed to make cooking accessible, enjoyable, and interactive.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-elevated hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-golden-light rounded-2xl flex items-center justify-center mb-6">
                  <ChefHat className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Expert Chefs</h3>
                <p className="text-muted-foreground leading-relaxed">Follow verified culinary experts, learn their techniques, and recreate their signature dishes in your own kitchen.</p>
              </div>

              <div className="card-elevated hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">AI Assistant</h3>
                <p className="text-muted-foreground leading-relaxed">Stuck on a step? Missing an ingredient? Ask our AI assistant for real-time substitutions, tips, and guidance.</p>
              </div>

              <div className="card-elevated hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Community Driven</h3>
                <p className="text-muted-foreground leading-relaxed">Share your creations, rate recipes, leave comments, and connect with other food enthusiasts around the globe.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
