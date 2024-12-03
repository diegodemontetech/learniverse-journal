import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

const UsersTab = () => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const { data: groups } = useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_groups")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleCreateUser = async () => {
    if (!email || !password || !firstName || !lastName || !selectedGroup) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Update profile with additional info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          group_id: selectedGroup,
        })
        .eq("id", authData.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setSelectedGroup("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-i2know-card border-none relative z-20">
      <CardHeader>
        <CardTitle>Criar Novo Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Digite o nome"
              className="bg-i2know-body border-none text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Digite o sobrenome"
              className="bg-i2know-body border-none text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o email"
            className="bg-i2know-body border-none text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
            className="bg-i2know-body border-none text-white"
          />
        </div>

        <div className="space-y-2">
          <Label>Grupo de Usuário</Label>
          <Select
            value={selectedGroup}
            onValueChange={setSelectedGroup}
          >
            <SelectTrigger className="bg-i2know-body border-none text-white">
              <SelectValue placeholder="Selecione um grupo" />
            </SelectTrigger>
            <SelectContent>
              {groups?.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreateUser}
          className="w-full bg-i2know-accent hover:bg-opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Usuário
        </Button>
      </CardContent>
    </Card>
  );
};

export default UsersTab;