import { Button } from "@/components/ui/button";

interface EbookViewerProps {
  ebook: {
    title: string;
    pdf_url: string;
    total_pages: number;
  } | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const EbookViewer = ({ ebook, currentPage, onPageChange }: EbookViewerProps) => {
  if (!ebook) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative min-h-[70vh]">
        <iframe
          src={ebook.pdf_url}
          className="w-full h-full absolute inset-0"
          title={ebook.title}
          loading="eager"
        />
      </div>
      <div className="flex justify-between items-center mt-4 gap-4">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="min-w-[100px]"
        >
          Anterior
        </Button>
        <span className="text-i2know-text-primary whitespace-nowrap">
          Página {currentPage} de {ebook.total_pages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= ebook.total_pages}
          className="min-w-[100px]"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default EbookViewer;