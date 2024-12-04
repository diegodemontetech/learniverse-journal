import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserForm from "./user/UserForm";
import UserList from "./user/UserList";
import { useState } from "react";

const UsersTab = () => {
  const [editingUser, setEditingUser] = useState<any>(null);

  return (
    <Tabs defaultValue="list" className="space-y-6">
      <TabsList className="bg-i2know-card border-none">
        <TabsTrigger value="list">Lista de Usuários</TabsTrigger>
        <TabsTrigger value="create">Criar Usuário</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <UserList onEdit={setEditingUser} />
      </TabsContent>

      <TabsContent value="create">
        <UserForm initialData={editingUser} onSuccess={() => setEditingUser(null)} mode={editingUser ? 'edit' : 'create'} />
      </TabsContent>
    </Tabs>
  );
};

export default UsersTab;