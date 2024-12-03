import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ebook } from "@/types/course";
import EbookForm from "./EbookForm";

interface EbookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEbook: Ebook | null;
  onSubmit: (formData: Partial<Ebook>) => void;
}

const EbookDialog = ({ isOpen, onOpenChange, selectedEbook, onSubmit }: EbookDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedEbook ? "Editar E-book" : "Novo E-book"}
          </DialogTitle>
        </DialogHeader>
        <EbookForm
          initialData={selectedEbook}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EbookDialog;