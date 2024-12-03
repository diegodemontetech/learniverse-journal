import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ImmersionTab = () => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*, positions(*)");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {departments?.map((department) => (
          <Card key={department.id} className="bg-i2know-card border-none">
            <CardHeader>
              <CardTitle className="text-white">{department.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {department.positions?.map((position: any) => (
                  <div key={position.id} className="flex items-center justify-between">
                    <span className="text-white">{position.name}</span>
                    <Button variant="outline">
                      Gerenciar Cursos de Imersão
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImmersionTab;