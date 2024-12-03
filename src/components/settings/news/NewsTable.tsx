import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface News {
  id: string;
  title: string;
  is_featured: boolean;
  layout_position: string;
  created_at: string;
}

interface NewsTableProps {
  news: News[];
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
}

const NewsTable = ({ news, onEdit, onDelete }: NewsTableProps) => {
  const getLayoutPositionLabel = (position: string) => {
    switch (position) {
      case "featured":
        return "Destaque Principal";
      case "most_read":
        return "Mais Lidas";
      case "regular":
        return "Regular";
      default:
        return position;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Posição</TableHead>
          <TableHead>Destaque</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{getLayoutPositionLabel(item.layout_position)}</TableCell>
            <TableCell>{item.is_featured ? "Sim" : "Não"}</TableCell>
            <TableCell>
              {new Date(item.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(item.id)}
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

export default NewsTable;