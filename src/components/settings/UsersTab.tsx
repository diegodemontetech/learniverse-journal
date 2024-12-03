import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserForm from "./user/UserForm";
import UserList from "./user/UserList";

const UsersTab = () => {
  return (
    <Tabs defaultValue="list" className="space-y-6">
      <TabsList className="bg-i2know-card border-none">
        <TabsTrigger value="list">Lista de Usuários</TabsTrigger>
        <TabsTrigger value="create">Criar Usuário</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <UserList />
      </TabsContent>

      <TabsContent value="create">
        <UserForm />
      </TabsContent>
    </Tabs>
  );
};

export default UsersTab;