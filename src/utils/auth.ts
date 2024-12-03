import { supabase } from "@/integrations/supabase/client";

export const getUserRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return profile?.role || 'user';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
};

export const isAdmin = async () => {
  const role = await getUserRole();
  return role === 'admin';
};