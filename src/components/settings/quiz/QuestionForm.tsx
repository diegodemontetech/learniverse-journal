import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  question: z.string().min(3, "A pergunta deve ter pelo menos 3 caracteres"),
  correctAnswer: z.string().min(1, "A resposta correta é obrigatória"),
  options: z.string().min(1, "As opções são obrigatórias"),
  orderNumber: z.coerce.number().min(1, "A ordem deve ser maior que 0"),
  points: z.coerce.number().min(1, "A pontuação deve ser maior que 0"),
});

interface QuestionFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  defaultValues?: z.infer<typeof formSchema>;
  isEdit?: boolean;
}

const QuestionForm = ({ onSubmit, defaultValues, isEdit }: QuestionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      question: "",
      correctAnswer: "",
      options: "",
      orderNumber: 1,
      points: 10,
    },
  });

  return (
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
                  className="bg-[#2C2C2C] border-none"
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
                  className="bg-[#2C2C2C] border-none"
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
                  className="bg-[#2C2C2C] border-none"
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
                  <Input 
                    type="number" 
                    min={1} 
                    {...field}
                    className="bg-[#2C2C2C] border-none"
                  />
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
                  <Input 
                    type="number" 
                    min={1} 
                    {...field}
                    className="bg-[#2C2C2C] border-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {isEdit ? "Atualizar" : "Criar"}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;