import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider, useSessionContext } from "@supabase/auth-helpers-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "./integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "./components/ui/use-toast";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import News from "./pages/News";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Ebooks from "./pages/Ebooks";
import EbookView from "./pages/EbookView";
import Immersion from "./pages/Immersion";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      meta: {
        errorHandler: (error: any) => {
          if (error?.message?.includes('JWT') || error?.message?.includes('session')) {
            queryClient.clear();
            supabase.auth.signOut();
          }
        }
      }
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error || !currentSession) {
          await supabase.auth.signOut();
          queryClient.clear();
          toast({
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/auth");
      }
    };

    if (!isLoading) {
      checkSession();
    }
  }, [isLoading, navigate, toast]);

  // Set up subscription to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        queryClient.clear();
        navigate("/auth");
      } else if (event === 'SIGNED_IN') {
        // Verify the session is valid
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          await supabase.auth.signOut();
          navigate("/auth");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return children;
};

const ProtectedContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseView />} />
      <Route path="/news" element={<News />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/ebooks" element={<Ebooks />} />
      <Route path="/ebooks/:id" element={<EbookView />} />
      <Route path="/immersion" element={<Immersion />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <TooltipProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProtectedContent />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </TooltipProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;