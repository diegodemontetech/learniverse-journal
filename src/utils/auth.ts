import { supabase } from "@/integrations/supabase/client";

export const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role || 'user';
};

export const isAdmin = async () => {
  const role = await getUserRole();
  return role === 'admin';
};