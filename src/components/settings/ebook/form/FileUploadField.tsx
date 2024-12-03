import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploadFieldProps {
  id: string;
  label: string;
  accept: string;
  previewUrl?: string | null;
  isUploading: boolean;
  uploadProgress: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField = ({
  id,
  label,
  accept,
  previewUrl,
  isUploading,
  uploadProgress,
  onFileSelect,
}: FileUploadFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={onFileSelect}
          className="hidden"
          id={id}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(id)?.click()}
          className="w-full"
        >
          <FileUp className="w-4 h-4 mr-2" />
          Upload {label}
        </Button>
      </div>
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-gray-400 text-center">{uploadProgress}%</p>
        </div>
      )}
      {previewUrl && label === "Thumbnail" && (
        <img 
          src={previewUrl} 
          alt="Thumbnail preview" 
          className="mt-2 h-20 object-cover rounded"
        />
      )}
    </div>
  );
};

export default FileUploadField;