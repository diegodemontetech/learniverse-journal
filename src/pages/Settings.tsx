import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserGroupsTab from "@/components/settings/UserGroupsTab";
import UsersTab from "@/components/settings/UsersTab";
import CoursesTab from "@/components/settings/CoursesTab";
import LessonsTab from "@/components/settings/LessonsTab";
import QuizzesTab from "@/components/settings/QuizzesTab";
import FeaturedTab from "@/components/settings/FeaturedTab";
import NewsTab from "@/components/settings/NewsTab";
import CertificatesTab from "@/components/settings/CertificatesTab";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Not authenticated");
        }

        // Try to get the profile
        let { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // If profile doesn't exist, create it
        if (error?.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, role: 'user' }])
            .select("role")
            .single();

          if (createError) throw createError;
          profile = newProfile;
        } else if (error) {
          throw error;
        }

        if (!profile || profile.role !== "admin") {
          throw new Error("Not authorized");
        }
      } catch (error) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  return (
    <div className="p-8 bg-i2know-body min-h-screen z-10">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8">Configurações</h1>
        
        <Tabs defaultValue="user-groups" className="space-y-6">
          <TabsList className="bg-i2know-card relative z-10">
            <TabsTrigger value="user-groups">Grupos de Usuários</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="lessons">Aulas</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="featured">Destaques</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
          </TabsList>

          <TabsContent value="user-groups" className="relative z-10">
            <UserGroupsTab />
          </TabsContent>
          
          <TabsContent value="users" className="relative z-10">
            <UsersTab />
          </TabsContent>
          
          <TabsContent value="courses" className="relative z-10">
            <CoursesTab />
          </TabsContent>
          
          <TabsContent value="lessons" className="relative z-10">
            <LessonsTab />
          </TabsContent>
          
          <TabsContent value="quizzes" className="relative z-10">
            <QuizzesTab />
          </TabsContent>
          
          <TabsContent value="featured" className="relative z-10">
            <FeaturedTab />
          </TabsContent>
          
          <TabsContent value="news" className="relative z-10">
            <NewsTab />
          </TabsContent>
          
          <TabsContent value="certificates" className="relative z-10">
            <CertificatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;