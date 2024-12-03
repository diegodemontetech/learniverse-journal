import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2 } from "lucide-react";

interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string;
  issued_at: string;
  course: {
    title: string;
  };
  user: {
    first_name: string;
    last_name: string;
  };
}

interface CertificateFormData {
  user_id: string;
  course_id: string;
  certificate_url: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface Course {
  id: string;
  title: string;
}

const CertificatesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>({
    user_id: "",
    course_id: "",
    certificate_url: "",
  });

  const { data: certificates, isLoading: isLoadingCertificates } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `*, course:courses(title), user:profiles(first_name, last_name)`
        )
        .order("issued_at", { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");

      if (error) throw error;
      return data as User[];
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title");

      if (error) throw error;
      return data as Course[];
    },
  });

  const createCertificateMutation = useMutation({
    mutationFn: async (data: CertificateFormData) => {
      const { error } = await supabase.from("certificates").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({ title: "Certificado criado com sucesso!" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao criar certificado",
        variant: "destructive",
      });
    },
  });

  const updateCertificateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CertificateFormData;
    }) => {
      const { error } = await supabase
        .from("certificates")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({ title: "Certificado atualizado com sucesso!" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar certificado",
        variant: "destructive",
      });
    },
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({ title: "Certificado excluído com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir certificado",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCertificate) {
      updateCertificateMutation.mutate({
        id: editingCertificate.id,
        data: formData,
      });
    } else {
      createCertificateMutation.mutate(formData);
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      user_id: certificate.user_id,
      course_id: certificate.course_id,
      certificate_url: certificate.certificate_url,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este certificado?")) {
      deleteCertificateMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      course_id: "",
      certificate_url: "",
    });
    setEditingCertificate(null);
  };

  if (isLoadingCertificates) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Gerenciar Certificados
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsOpen(true);
              }}
            >
              Novo Certificado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCertificate
                  ? "Editar Certificado"
                  : "Novo Certificado"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="user_id" className="text-sm font-medium">
                  Usuário
                </label>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, user_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="course_id" className="text-sm font-medium">
                  Curso
                </label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="certificate_url" className="text-sm font-medium">
                  URL do Certificado
                </label>
                <Input
                  id="certificate_url"
                  value={formData.certificate_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificate_url: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button type="submit">
                {editingCertificate ? "Atualizar" : "Criar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Data de Emissão</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates?.map((certificate) => (
            <TableRow key={certificate.id}>
              <TableCell>
                {certificate.user.first_name} {certificate.user.last_name}
              </TableCell>
              <TableCell>{certificate.course.title}</TableCell>
              <TableCell>
                {new Date(certificate.issued_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(certificate)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(certificate.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CertificatesTab;