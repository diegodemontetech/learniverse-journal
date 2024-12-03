import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  question: z.string().min(3, "A pergunta deve ter pelo menos 3 caracteres"),
  correctAnswer: z.string().min(1, "A resposta correta é obrigatória"),
  options: z.string().min(1, "As opções são obrigatórias"),
  orderNumber: z.coerce.number().min(1, "A ordem deve ser maior que 0"),
  points: z.coerce.number().min(1, "A pontuação deve ser maior que 0"),
});

interface QuizQuestionsProps {
  quizId: string;
}

const QuizQuestions = ({ quizId }: QuizQuestionsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      correctAnswer: "",
      options: "",
      orderNumber: 1,
      points: 10,
    },
  });

  const { data: questions, refetch: refetchQuestions } = useQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_number");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const options = values.options
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option !== "");

      if (options.length < 2) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos 2 opções, separadas por vírgula",
          variant: "destructive",
        });
        return;
      }

      if (!options.includes(values.correctAnswer)) {
        toast({
          title: "Erro",
          description: "A resposta correta deve estar entre as opções",
          variant: "destructive",
        });
        return;
      }

      if (selectedQuestion) {
        const { error } = await supabase
          .from("quiz_questions")
          .update({
            question: values.question,
            correct_answer: values.correctAnswer,
            options: options,
            order_number: values.orderNumber,
            points: values.points,
          })
          .eq("id", selectedQuestion.id);

        if (error) throw error;

        toast({
          title: "Questão atualizada",
          description: "A questão foi atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase.from("quiz_questions").insert({
          quiz_id: quizId,
          question: values.question,
          correct_answer: values.correctAnswer,
          options: options,
          order_number: values.orderNumber,
          points: values.points,
        });

        if (error) throw error;

        toast({
          title: "Questão criada",
          description: "A questão foi criada com sucesso!",
        });
      }

      form.reset();
      setSelectedQuestion(null);
      setIsDialogOpen(false);
      refetchQuestions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a questão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: any) => {
    setSelectedQuestion(question);
    form.reset({
      question: question.question,
      correctAnswer: question.correct_answer,
      options: question.options.join(", "),
      orderNumber: question.order_number,
      points: question.points,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("quiz_questions").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Questão excluída",
        description: "A questão foi excluída com sucesso!",
      });

      refetchQuestions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a questão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!quizId) {
    return (
      <div className="text-center text-muted-foreground">
        Selecione um quiz para gerenciar suas questões
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Questões do Quiz</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedQuestion(null);
                form.reset({
                  question: "",
                  correctAnswer: "",
                  options: "",
                  orderNumber: (questions?.length || 0) + 1,
                  points: 10,
                });
              }}
            >
              Nova Questão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedQuestion ? "Editar Questão" : "Nova Questão"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pergunta</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a pergunta"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opções (separadas por vírgula)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Opção 1, Opção 2, Opção 3..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resposta Correta</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a resposta correta"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pontos</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {selectedQuestion ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Pergunta</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions?.map((question) => (
              <TableRow key={question.id}>
                <TableCell>{question.order_number}</TableCell>
                <TableCell>{question.question}</TableCell>
                <TableCell>{question.points}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(question)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(question.id)}
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
    </div>
  );
};

export default QuizQuestions;