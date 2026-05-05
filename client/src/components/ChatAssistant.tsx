import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { Link } from "react-router-dom";

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "assistant", text: "Hi! How can I help you in the kitchen today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state: any) => state.auth);

  if (!userInfo) return null;

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { message: userMsg });
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I am having trouble connecting." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all z-50 ${isOpen ? 'bg-muted text-foreground rotate-90 scale-0 opacity-0' : 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-primary/30'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <div className={`fixed bottom-6 right-6 w-[350px] h-[500px] bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-bold">AI Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/chat" onClick={toggleChat} className="text-xs hover:underline opacity-80 mr-2">Full Page</Link>
            <button onClick={toggleChat} className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm text-sm"}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-border bg-background flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..." 
            className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4 ml-[-2px] mt-[1px]" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatAssistant;
