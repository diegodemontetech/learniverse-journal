import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UserGroupsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: groups } = useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_groups")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

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

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_groups")
        .insert({
          name: newGroupName,
          course_access: selectedCourses,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar grupo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_groups")
        .update({
          name: newGroupName,
          course_access: selectedCourses,
        })
        .eq("id", editingGroup.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast({
        title: "Sucesso",
        description: "Grupo atualizado com sucesso!",
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar grupo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_groups")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast({
        title: "Sucesso",
        description: "Grupo excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir grupo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do grupo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (editingGroup) {
      updateGroupMutation.mutate();
    } else {
      createGroupMutation.mutate();
    }
  };

  const handleEdit = (group: any) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setSelectedCourses(group.course_access || []);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este grupo?")) {
      deleteGroupMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setNewGroupName("");
    setSelectedCourses([]);
    setEditingGroup(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Grupos de Usuários</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-i2know-card border-none">
            <DialogHeader>
              <DialogTitle>{editingGroup ? "Editar Grupo" : "Novo Grupo"}</DialogTitle>
              <DialogDescription>
                Preencha as informações do grupo de usuários
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
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
                onClick={handleSubmit}
                className="w-full"
              >
                {editingGroup ? "Atualizar" : "Criar"} Grupo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-i2know-card border-none">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cursos Disponíveis</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups?.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.course_access?.length || 0} cursos</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(group)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGroupsTab;