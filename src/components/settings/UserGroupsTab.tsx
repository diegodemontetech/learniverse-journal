import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

const UserGroupsTab = () => {
  const { toast } = useToast();
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do grupo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_groups")
        .insert({
          name: newGroupName,
          course_access: selectedCourses,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });

      setNewGroupName("");
      setSelectedCourses([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar grupo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-i2know-card border-none">
      <CardHeader>
        <CardTitle>Criar Novo Grupo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="groupName">Nome do Grupo</Label>
          <Input
            id="groupName"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Digite o nome do grupo"
            className="bg-i2know-body border-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Cursos Disponíveis</Label>
          <div className="grid grid-cols-2 gap-4">
            {courses?.map((course) => (
              <div key={course.id} className="flex items-center space-x-2">
                <Checkbox
                  id={course.id}
                  checked={selectedCourses.includes(course.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCourses([...selectedCourses, course.id]);
                    } else {
                      setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                    }
                  }}
                />
                <Label htmlFor={course.id}>{course.title}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleCreateGroup}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Grupo
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserGroupsTab;