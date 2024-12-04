import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFormFieldsProps {
  mode: 'create' | 'edit';
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedPosition: string;
  setSelectedPosition: (value: string) => void;
  groups?: any[];
  departments?: any[];
  positions?: any[];
}

const UserFormFields = ({
  mode,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  selectedRole,
  setSelectedRole,
  selectedGroup,
  setSelectedGroup,
  selectedDepartment,
  setSelectedDepartment,
  selectedPosition,
  setSelectedPosition,
  groups,
  departments,
  positions,
}: UserFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default UserFormFields;