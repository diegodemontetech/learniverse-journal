import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation2 } from "lucide-react";
import CourseManagementDialog from "@/components/immersion/CourseManagementDialog";

const Immersion = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
        .select("*, courses(*)")
        .eq("position_id", userProfile.position_id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.position_id,
  });

  const isAdmin = userProfile?.role === "admin";

  if (isLoadingCourses) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Navigation2 className="w-6 h-6 text-i2know-accent" />
          <h1 className="text-2xl font-bold text-white">Imersão</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Navigation2 className="w-6 h-6 text-i2know-accent" />
          <h1 className="text-2xl font-bold text-white">Trilha de Imersão</h1>
        </div>

        {userProfile?.position_id ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {immersionCourses?.map((item: any) => (
              <Card key={item.course_id} className="bg-i2know-card border-none">
                <CardHeader>
                  <CardTitle className="text-white">{item.courses.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-i2know-text-secondary">{item.courses.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-white">Nenhum cargo atribuído ainda. Entre em contato com seu administrador.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Navigation2 className="w-6 h-6 text-i2know-accent" />
        <h1 className="text-2xl font-bold text-white">Gerenciar Imersão</h1>
      </div>

      {/* Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {departments?.map((department) => (
          <Card 
            key={department.id}
            className={`bg-i2know-card border-none cursor-pointer transition-colors ${
              selectedDepartment === department.id ? 'ring-2 ring-i2know-accent' : ''
            }`}
            onClick={() => setSelectedDepartment(department.id)}
          >
            <CardHeader>
              <CardTitle className="text-white">{department.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Positions */}
      {selectedDepartment && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Cargos</h2>
          {isLoadingPositions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {positions?.map((position) => (
                <Card key={position.id} className="bg-i2know-card border-none">
                  <CardHeader>
                    <CardTitle className="text-white">{position.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedPosition({
                        id: position.id,
                        name: position.name,
                      })}
                    >
                      Gerenciar Cursos
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Course Management Dialog */}
      {selectedPosition && (
        <CourseManagementDialog
          positionId={selectedPosition.id}
          positionName={selectedPosition.name}
          open={!!selectedPosition}
          onOpenChange={(open) => !open && setSelectedPosition(null)}
        />
      )}
    </div>
  );
};

export default Immersion;
