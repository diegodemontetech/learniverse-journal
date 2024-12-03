import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail_url: string;
  pdf_url: string;
  total_pages: number;
  category_id: string;
  category: {
    name: string;
  };
}

const EbooksTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category_id: "",
    total_pages: 0,
    thumbnail_url: "",
    pdf_url: "",
  });

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select(`*, category:categories(name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ebook[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const createEbookMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("ebooks").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book criado com sucesso!" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao criar e-book",
        variant: "destructive",
      });
    },
  });

  const updateEbookMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: typeof formData;
    }) => {
      const { error } = await supabase
        .from("ebooks")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book atualizado com sucesso!" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar e-book",
        variant: "destructive",
      });
    },
  });

  const deleteEbookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ebooks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book excluído com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir e-book",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEbook) {
      updateEbookMutation.mutate({
        id: selectedEbook.id,
        data: formData,
      });
    } else {
      createEbookMutation.mutate(formData);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setFormData({
      title: ebook.title,
      author: ebook.author,
      description: ebook.description,
      category_id: ebook.category_id,
      total_pages: ebook.total_pages,
      thumbnail_url: ebook.thumbnail_url,
      pdf_url: ebook.pdf_url,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este e-book?")) {
      deleteEbookMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category_id: "",
      total_pages: 0,
      thumbnail_url: "",
      pdf_url: "",
    });
    setSelectedEbook(null);
  };

  const handlePageChange = async (newPage: number) => {
    if (!selectedEbook) return;
    
    setCurrentPage(newPage);
    
    // Update reading progress in the database
    const { error } = await supabase.from("user_ebook_progress").upsert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ebook_id: selectedEbook.id,
      current_page: newPage,
      completed_at: newPage === selectedEbook.total_pages ? new Date().toISOString() : null,
    });

    if (error) {
      toast({
        title: "Erro ao atualizar progresso",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">E-books</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsOpen(true);
              }}
            >
              Novo E-book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEbook ? "Editar E-book" : "Novo E-book"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Autor</label>
                  <Input
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Sinopse</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Quantidade de Páginas
                  </label>
                  <Input
                    type="number"
                    value={formData.total_pages}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_pages: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL da Thumbnail</label>
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail_url: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL do PDF</label>
                  <Input
                    value={formData.pdf_url}
                    onChange={(e) =>
                      setFormData({ ...formData, pdf_url: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {selectedEbook ? "Atualizar" : "Criar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="max-w-[95vw] h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedEbook?.title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col h-full">
              <div className="flex-1 relative">
                <iframe
                  src={selectedEbook?.pdf_url}
                  className="w-full h-full"
                  title={selectedEbook?.title}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </Button>
                <span>
                  Página {currentPage} de {selectedEbook?.total_pages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    !selectedEbook || currentPage >= selectedEbook.total_pages
                  }
                >
                  Próxima
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
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
                      onClick={() => {
                        setSelectedEbook(ebook);
                        setCurrentPage(1);
                        setViewerOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(ebook)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EbooksTab;