import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import UserFormFields from "./form/UserFormFields";

interface UserFormProps {
  initialData?: any;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const UserForm = ({ initialData, onSuccess, mode = 'create' }: UserFormProps) => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(initialData?.first_name || "");
  const [lastName, setLastName] = useState(initialData?.last_name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(initialData?.role || "user");
  const [selectedGroup, setSelectedGroup] = useState(initialData?.group_id || "");
  const [selectedDepartment, setSelectedDepartment] = useState(initialData?.department_id || "");
  const [selectedPosition, setSelectedPosition] = useState(initialData?.position_id || "");

  const { data: groups } = useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_groups").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("positions").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    try {
      if (mode === 'edit') {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            first_name: firstName,
            last_name: lastName,
            role: selectedRole,
            group_id: selectedRole === "admin" ? null : selectedGroup,
            department_id: selectedDepartment,
            position_id: selectedPosition,
          })
          .eq("id", initialData.id);

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "User updated successfully!",
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        if (!email || !password || !firstName || !lastName || !selectedRole) {
          toast({
            title: "Error",
            description: "All required fields must be filled",
            variant: "destructive",
          });
          return;
        }

        if (selectedRole === "user" && !selectedGroup) {
          toast({
            title: "Error",
            description: "User group is required for regular users",
            variant: "destructive",
          });
          return;
        }

        // First check if user exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          toast({
            title: "Error",
            description: "A user with this email already exists",
            variant: "destructive",
          });
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          if (authError.message.includes('already registered')) {
            toast({
              title: "Error",
              description: "A user with this email already exists",
              variant: "destructive",
            });
            return;
          }
          throw authError;
        }

        if (!authData.user?.id) {
          throw new Error("Failed to create user");
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            first_name: firstName,
            last_name: lastName,
            group_id: selectedRole === "admin" ? null : selectedGroup,
            department_id: selectedDepartment,
            position_id: selectedPosition,
            role: selectedRole,
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "User created successfully!",
        });

        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setSelectedRole("user");
        setSelectedGroup("");
        setSelectedDepartment("");
        setSelectedPosition("");

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("User form error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-i2know-card border-none">
      {mode === 'create' && (
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <UserFormFields
          mode={mode}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          groups={groups}
          departments={departments}
          positions={positions}
        />

        <Button 
          onClick={handleSubmit}
          className="w-full bg-i2know-accent hover:bg-opacity-90"
        >
          {mode === 'create' && <Plus className="w-4 h-4 mr-2" />}
          {mode === 'create' ? 'Create User' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserForm;