import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Ebook } from "@/types/course";

interface EbookListProps {
  ebooks: Ebook[];
  onEdit: (ebook: Ebook) => void;
  onDelete: (id: string) => void;
  onView: (ebook: Ebook) => void;
}

const EbookList = ({ ebooks, onEdit, onDelete, onView }: EbookListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Páginas</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ebooks?.map((ebook) => (
          <TableRow key={ebook.id}>
            <TableCell>{ebook.title}</TableCell>
            <TableCell>{ebook.author}</TableCell>
            <TableCell>{ebook.category?.name}</TableCell>
            <TableCell>{ebook.total_pages}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(ebook)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(ebook)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(ebook.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EbookList;