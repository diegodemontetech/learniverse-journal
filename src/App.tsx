import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "./integrations/supabase/client";
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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Implement your logic to protect routes (e.g. check for authentication)
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