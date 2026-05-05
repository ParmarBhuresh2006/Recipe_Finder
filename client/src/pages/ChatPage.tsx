import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Trash2, ChefHat, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface Message {
  role: "assistant" | "user";
  text: string;
  time: string;
}

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      text: "Hello there! I'm your AI cooking assistant. Ask me anything about recipes, ingredients, cooking techniques, or meal planning!", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages((prev) => [...prev, { role: "user", text: userMsg, time }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { message: userMsg });
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          text: data.reply || "I couldn't process that. Try asking for a recipe!", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          text: "Sorry, I am having trouble connecting to my brain right now. Please try again later.", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        { 
          role: "assistant", 
          text: "Chat cleared! What would you like to cook next?", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-140px)]">
        <div className="card-elevated flex-1 flex flex-col max-w-4xl mx-auto w-full h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-golden-light flex items-center justify-center border border-border shrink-0">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-foreground text-lg">AI Cooking Assistant</h1>
                <p className="text-sm text-muted-foreground">Your smart chef, powered by Gemini</p>
              </div>
            </div>
            <button onClick={clearChat} className="p-2 border border-border rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive" title="Clear Chat">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%]">
                  <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot shadow-sm border border-border/50"}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1.5 ${msg.role === "user" ? "text-right mr-1" : "ml-1"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-bot shadow-sm border border-border/50 flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex items-end gap-3 pt-4 border-t border-border mt-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Ask me for recipe ideas, substitutions, or cooking tips..."
              className="flex-1 border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[52px] max-h-32"
              rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 4) : 1}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className={`btn-golden flex items-center gap-2 h-[52px] ${loading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Send className="h-4 w-4" /> <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
