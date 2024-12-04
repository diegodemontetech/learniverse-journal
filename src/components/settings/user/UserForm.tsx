import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

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
        // Update profile
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
      } else {
        // Create new user
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

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

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
          .eq("id", authData.user?.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: `User ${mode === 'edit' ? 'updated' : 'created'} successfully!`,
      });

      if (onSuccess) {
        onSuccess();
      }

      // Reset form if creating
      if (mode === 'create') {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setSelectedRole("user");
        setSelectedGroup("");
        setSelectedDepartment("");
        setSelectedPosition("");
      }
    } catch (error: any) {
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              className="bg-i2know-body border-none text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              className="bg-i2know-body border-none text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {mode === 'create' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="bg-i2know-body border-none text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-i2know-body border-none text-white placeholder:text-gray-400"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>User Type</Label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger className="bg-i2know-body border-none text-white">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedRole === "user" && (
          <div className="space-y-2">
            <Label>User Group</Label>
            <Select
              value={selectedGroup}
              onValueChange={setSelectedGroup}
            >
              <SelectTrigger className="bg-i2know-body border-none text-white">
                <SelectValue placeholder="Select a group" />
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
        )}

        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="bg-i2know-body border-none text-white">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <Select
            value={selectedPosition}
            onValueChange={setSelectedPosition}
          >
            <SelectTrigger className="bg-i2know-body border-none text-white">
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              {positions?.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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