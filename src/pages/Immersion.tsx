import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation2, CheckCircle2, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Immersion = () => {
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*, positions(*)")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: immersionCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["immersion-courses", userProfile?.position_id],
    queryFn: async () => {
      if (!userProfile?.position_id) return [];
      
      const { data, error } = await supabase
        .from("position_courses")
        .select(`
          *,
          courses(
            *,
            user_progress(*)
          )
        `)
        .eq("position_id", userProfile.position_id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.position_id,
  });

  if (isLoadingCourses) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Navigation2 className="w-6 h-6 text-i2know-accent" />
          <h1 className="text-2xl font-bold text-white">Trilha de Imersão</h1>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const calculateProgress = (course: any) => {
    if (!course.user_progress?.length) return 0;
    return course.user_progress[0].progress_percentage || 0;
  };

  const isCourseLocked = (index: number) => {
    if (index === 0) return false;
    const previousCourse = immersionCourses?.[index - 1]?.courses;
    return previousCourse && calculateProgress(previousCourse) < 100;
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Navigation2 className="w-6 h-6 text-i2know-accent" />
        <h1 className="text-2xl font-bold text-white">Trilha de Imersão</h1>
      </div>

      {userProfile?.position_id ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {immersionCourses?.map((item: any, index: number) => {
            const progress = calculateProgress(item.courses);
            const locked = isCourseLocked(index);

            return (
              <Card 
                key={item.course_id} 
                className={`bg-i2know-card border-none relative ${
                  locked ? 'opacity-50' : ''
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {progress === 100 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {locked && (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                    {item.courses.title}
                  </CardTitle>
                  <span className="text-sm text-i2know-text-secondary">
                    {progress}% concluído
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-i2know-text-secondary mb-4">
                    {item.courses.description}
                  </p>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-white text-center">
          Nenhum cargo atribuído ainda. Entre em contato com seu administrador.
        </p>
      )}
    </div>
  );
};

export default Immersion;