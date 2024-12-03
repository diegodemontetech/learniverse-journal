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
      <div className="flex-1 relative">
        <iframe
          src={ebook.pdf_url}
          className="w-full h-full"
          title={ebook.title}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {ebook.total_pages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= ebook.total_pages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default EbookViewer;