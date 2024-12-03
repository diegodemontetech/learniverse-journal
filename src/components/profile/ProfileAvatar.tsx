import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileAvatarProps {
  profile: any;
  refetchProfile: () => void;
}

const ProfileAvatar = ({ profile, refetchProfile }: ProfileAvatarProps) => {
  const { toast } = useToast();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });

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
    <div className="relative">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-4xl text-gray-600">
              {profile?.first_name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}
      </div>
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 bg-i2know-accent hover:bg-i2know-accent/90 p-2 rounded-full cursor-pointer"
      >
        <Camera className="w-5 h-5 text-white" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </label>
    </div>
  );
};

export default ProfileAvatar;