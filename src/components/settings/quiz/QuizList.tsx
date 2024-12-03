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

interface QuizListProps {
  quizzes?: any[];
  onEdit: (quiz: any) => void;
  onDelete: (id: string) => void;
  onSelectQuiz: (quiz: any) => void;
}

const QuizList = ({ quizzes, onEdit, onDelete, onSelectQuiz }: QuizListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Nota Mínima</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes?.map((quiz) => (
            <TableRow
              key={quiz.id}
              className="cursor-pointer"
              onClick={() => onSelectQuiz(quiz)}
            >
              <TableCell>{quiz.title}</TableCell>
              <TableCell>{quiz.courses?.title}</TableCell>
              <TableCell>{quiz.passing_score}%</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(quiz);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(quiz.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuizList;