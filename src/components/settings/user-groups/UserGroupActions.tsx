import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserGroupActionsProps {
  group: any;
  onEdit: (group: any) => void;
}

const UserGroupActions = ({ group, onEdit }: UserGroupActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteGroupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_groups")
        .delete()
        .eq("id", group.id);
      
      if (error) {
        if (error.message.includes("Cannot delete group with associated users")) {
          throw new Error("Este grupo possui usuários associados. Por favor, reatribua os usuários antes de excluir o grupo.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast({
        title: "Sucesso",
        description: "Grupo excluído com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(group)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (window.confirm("Tem certeza que deseja excluir este grupo?")) {
            deleteGroupMutation.mutate();
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserGroupActions;