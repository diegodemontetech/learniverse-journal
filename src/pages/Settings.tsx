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
import ImmersionTab from "@/components/settings/ImmersionTab";
import CategoriesTab from "@/components/settings/CategoriesTab";

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

        let { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

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
    <div className="p-8 bg-i2know-body min-h-screen relative z-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Configurações</h1>
        
        <Tabs defaultValue="user-groups" className="space-y-6">
          <TabsList className="bg-i2know-card border-none">
            <TabsTrigger value="user-groups">Grupos de Usuários</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="lessons">Aulas</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="featured">Destaques</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="immersion">Imersão</TabsTrigger>
          </TabsList>

          <div className="relative z-10">
            <TabsContent value="user-groups">
              <UserGroupsTab />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersTab />
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoriesTab />
            </TabsContent>
            
            <TabsContent value="courses">
              <CoursesTab />
            </TabsContent>
            
            <TabsContent value="lessons">
              <LessonsTab />
            </TabsContent>
            
            <TabsContent value="quizzes">
              <QuizzesTab />
            </TabsContent>
            
            <TabsContent value="featured">
              <FeaturedTab />
            </TabsContent>
            
            <TabsContent value="news">
              <NewsTab />
            </TabsContent>
            
            <TabsContent value="certificates">
              <CertificatesTab />
            </TabsContent>

            <TabsContent value="immersion">
              <ImmersionTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;