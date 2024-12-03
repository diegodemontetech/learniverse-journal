import { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  profile: any;
  refetchProfile: () => void;
}

const ProfileForm = ({ profile, refetchProfile }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsEditing(false);
      refetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="bg-i2know-body border-none"
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="bg-i2know-body border-none"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">
          <Phone className="w-4 h-4 inline-block mr-2" />
          Phone
        </Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="bg-i2know-body border-none"
        />
      </div>

      <div>
        <Label htmlFor="address">
          <MapPin className="w-4 h-4 inline-block mr-2" />
          Address
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="bg-i2know-body border-none"
        />
      </div>

      <div className="flex justify-end gap-4">
        {!isEditing ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-i2know-accent hover:bg-i2know-accent/90"
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  first_name: profile?.first_name || "",
                  last_name: profile?.last_name || "",
                  phone: profile?.phone || "",
                  address: profile?.address || "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-i2know-accent hover:bg-i2know-accent/90"
            >
              Save Changes
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;