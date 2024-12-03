import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupportMaterialListProps {
  lessonId: string | null;
}

const SupportMaterialList = ({ lessonId }: SupportMaterialListProps) => {
  const { toast } = useToast();

  const { data: materials, refetch } = useQuery({
    queryKey: ["support-materials", lessonId],
    queryFn: async () => {
      if (!lessonId) return [];
      const { data, error } = await supabase
        .from("support_materials")
        .select("*")
        .eq("lesson_id", lessonId);
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  const handleDelete = async (id: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("support_materials")
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("support_materials")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Material excluído com sucesso",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("support_materials")
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!materials?.length) {
    return <p className="text-sm text-gray-500">Nenhum material de apoio disponível</p>;
  }

  return (
    <div className="space-y-2">
      {materials.map((material) => (
        <div
          key={material.id}
          className="flex items-center justify-between p-2 bg-[#1f1f1f] rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{material.title}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(material.file_path, material.title)}
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(material.id, material.file_path)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportMaterialList;