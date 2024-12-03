import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const SupportMaterials = () => {
  return (
    <div className="bg-[#161616] rounded-lg p-6">
      <h3 className="text-white font-medium mb-4">Support Materials</h3>
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2">
          <FileText className="w-4 h-4" />
          Lesson Notes.pdf
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <FileText className="w-4 h-4" />
          Exercise Files.zip
        </Button>
      </div>
    </div>
  );
};

export default SupportMaterials;