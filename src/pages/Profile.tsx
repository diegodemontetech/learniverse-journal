import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileForm from "@/components/profile/ProfileForm";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { data: profile, refetch: refetchProfile, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          departments(name),
          positions(name),
          reports_to:profiles(first_name, last_name)
        `)
        .eq("id", user.id)
        .single();

      if (error) {
        // If the profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{ id: user.id }])
            .select()
            .single();

          if (createError) throw createError;
          return newProfile;
        }
        throw error;
      }
      return data;
    },
    onError: (error) => {
      console.error('Profile error:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-i2know-card rounded-lg p-8">
          <p className="text-center text-red-500">
            Failed to load profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-i2know-card rounded-lg p-8 space-y-8">
        <div className="flex items-center gap-8">
          <ProfileAvatar profile={profile} refetchProfile={refetchProfile} />
          <ProfileInfo profile={profile} />
        </div>
        <ProfileForm profile={profile} refetchProfile={refetchProfile} />
      </div>
    </div>
  );
};

export default Profile;