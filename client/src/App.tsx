import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatAssistant from "./components/ChatAssistant";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChefDetailPage from "./pages/ChefDetailPage";
import ChefsListPage from "./pages/ChefsListPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import MenuPage from "./pages/MenuPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import NotFound from "./pages/NotFound";

const App = () => {
  useEffect(() => {
    // Basic socket connection for demonstrative purposes
    const socket = io('http://localhost:5000', {
       withCredentials: true
    });
    
    socket.on('new_notification', (data) => {
       console.log('New notification received:', data);
       // We could show a toast here in a real app using the Sonner toaster
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chefs" element={<ChefsListPage />} />
          <Route path="/chefs/:id" element={<ChefDetailPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipe" element={<RecipeDetailPage />} />
          <Route path="/create-recipe" element={<CreateRecipePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
