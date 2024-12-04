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
import { deleteEbook } from "@/utils/deleteHandlers";
import { useQueryClient } from "@tanstack/react-query";

interface EbookListProps {
  ebooks: Ebook[];
  onEdit: (ebook: Ebook) => void;
  onDelete: (id: string) => void;
  onView: (ebook: Ebook) => void;
}

const EbookList = ({ ebooks, onEdit, onDelete, onView }: EbookListProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this ebook?")) {
      const { success } = await deleteEbook(id);
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ["ebooks"] });
        onDelete(id);
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Pages</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
                onClick={() => handleDelete(ebook.id)}
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