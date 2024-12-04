import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from "./UserForm";

const UserList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: users, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          *,
          departments(name),
          positions(name),
          user_groups(name)
        `);

      if (error) throw error;
      return profiles;
    },
  });

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        // Delete from auth.users which will cascade to profiles
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) throw authError;

        // Delete from profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);
          
        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "User deleted successfully",
        });

        queryClient.invalidateQueries({ queryKey: ["profiles"] });
      } catch (error: any) {
        console.error("Delete user error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEditSuccess = async () => {
    setEditingUser(null);
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  const filteredUsers = users?.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-i2know-body border-none text-white placeholder:text-gray-400"
      />
      
      <div className="rounded-md border border-i2know-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`}</TableCell>
                <TableCell>{user.departments?.name}</TableCell>
                <TableCell>{user.positions?.name}</TableCell>
                <TableCell>{user.user_groups?.name}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="bg-i2know-card border-none">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm 
              initialData={editingUser}
              onSuccess={handleEditSuccess}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserList;