import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ebook } from "@/types/course";
import EbookViewer from "./EbookViewer";

interface EbookViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEbook: Ebook | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const EbookViewerDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedEbook, 
  currentPage, 
  onPageChange 
}: EbookViewerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[90vh]">
        <DialogHeader>
          <DialogTitle>{selectedEbook?.title}</DialogTitle>
        </DialogHeader>
        <EbookViewer
          ebook={selectedEbook}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EbookViewerDialog;