import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Quartos from "./pages/Quartos";
import Estrutura from "./pages/Estrutura";
import Contatos from "./pages/Contatos";
import Politica from "./pages/Politica";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRooms from "./pages/AdminRooms";
import AdminReviews from "./pages/AdminReviews";
import AdminBanners from "./pages/AdminBanners";
import AdminContacts from "./pages/AdminContacts";
import AdminContent from "./pages/AdminContent";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/quartos" element={<Quartos />} />
            <Route path="/estrutura" element={<Estrutura />} />
            <Route path="/contatos" element={<Contatos />} />
            <Route path="/politica-e-privacidade-de-reservas" element={<Politica />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/quartos" element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
            <Route path="/admin/avaliacoes" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
            <Route path="/admin/banners" element={<ProtectedRoute><AdminBanners /></ProtectedRoute>} />
            <Route path="/admin/contatos" element={<ProtectedRoute><AdminContacts /></ProtectedRoute>} />
            <Route path="/admin/conteudo" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
