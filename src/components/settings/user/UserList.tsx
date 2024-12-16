import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import UserTableRow from "./UserTableRow";

interface UserListProps {
  onEdit: (user: any) => void;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  email?: string | null;
}

const UserList = ({ onEdit }: UserListProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      return profiles?.map((profile: Profile) => ({
        ...profile,
        email: profile.id === currentUser?.id ? currentUser.email : "Email hidden"
      })) || [];
    },
  });

  const handleDelete = async (userId: string) => {
    try {
      setIsDeleting(true);
      console.log("Attempting to delete user:", userId);

      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }

      console.log("Delete response:", data);

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading users: {(error as Error).message}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (!users?.length) {
    return <div className="p-4">No users found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: Profile) => (
          <UserTableRow
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;