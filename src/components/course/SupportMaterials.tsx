import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupportMaterialsProps {
  lessonId?: string;
}

export const SupportMaterials = ({ lessonId }: SupportMaterialsProps) => {
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

      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Download error:", error);
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
    <div className="bg-[#161616] rounded-lg p-4 sm:p-6">
      <h3 className="text-white font-medium mb-4">Materiais de Apoio</h3>
      <div className="space-y-2">
        {materials.map((material) => (
          <Button
            key={material.id}
            variant="outline"
            className="w-full justify-start gap-2 bg-[#272727] border-[#3a3a3a] text-white hover:bg-[#3a3a3a] min-h-[44px]"
            onClick={() => handleDownload(material.file_path, material.title)}
          >
            <FileText className="min-w-[16px] w-4 h-4" />
            <span className="truncate">{material.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SupportMaterials;
