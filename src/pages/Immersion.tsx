import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation2 } from "lucide-react";

const Immersion = () => {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: positions, isLoading: isLoadingPositions } = useQuery({
    queryKey: ["positions", selectedDepartment],
    queryFn: async () => {
      let query = supabase
        .from("positions")
        .select("*, departments(name)");
      
      if (selectedDepartment) {
        query = query.eq("department_id", selectedDepartment);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDepartment,
  });

  if (isLoadingDepartments) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Navigation2 className="w-6 h-6 text-i2know-accent" />
          <h1 className="text-2xl font-bold text-white">Immersion Courses</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Navigation2 className="w-6 h-6 text-i2know-accent" />
        <h1 className="text-2xl font-bold text-white">Immersion Courses</h1>
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
          <h2 className="text-xl font-semibold text-white mb-4">Positions</h2>
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
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Course management for this position will be available soon.",
                        });
                      }}
                    >
                      Manage Courses
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Immersion;