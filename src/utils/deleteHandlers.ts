import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const deleteUserGroup = async (groupId: string) => {
  try {
    const { data: users } = await supabase
      .from("profiles")
      .select("id")
      .eq("group_id", groupId);

    if (users && users.length > 0) {
      toast({
        title: "Cannot delete group",
        description: "This group has associated users. Please reassign users first.",
        variant: "destructive",
      });
      return { success: false };
    }

    const { error } = await supabase
      .from("user_groups")
      .delete()
      .eq("id", groupId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const deleteEbook = async (ebookId: string) => {
  try {
    const { error } = await supabase
      .from("ebooks")
      .delete()
      .eq("id", ebookId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    toast({
      title: "Error",
      description: "Failed to delete ebook. Please try again.",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    toast({
      title: "Error",
      description: "Failed to delete course. Please try again.",
      variant: "destructive",
    });
    return { success: false, error };
  }
};