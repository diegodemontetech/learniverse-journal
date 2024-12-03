import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupportMaterialsProps {
  lessonId?: string;
}

const SupportMaterials = ({ lessonId }: SupportMaterialsProps) => {
  const { toast } = useToast();

  const { data: materials } = useQuery({
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
        description: "Erro ao baixar o arquivo",
        variant: "destructive",
      });
    }
  };

  if (!materials?.length) {
    return null;
  }

  return (
    <div className="bg-[#161616] rounded-lg p-6">
      <h3 className="text-white font-medium mb-4">Materiais de Apoio</h3>
      <div className="space-y-2">
        {materials.map((material) => (
          <Button
            key={material.id}
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleDownload(material.file_path, material.title)}
          >
            <FileText className="w-4 h-4" />
            {material.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SupportMaterials;