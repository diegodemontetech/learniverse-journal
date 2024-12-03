import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseManagementDialogProps {
  positionId: string;
  positionName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourseManagementDialog = ({
  positionId,
  positionName,
  open,
  onOpenChange,
}: CourseManagementDialogProps) => {
  const { toast } = useToast();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: positionCourses, refetch: refetchPositionCourses } = useQuery({
    queryKey: ["position-courses", positionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("position_courses")
        .select("course_id")
        .eq("position_id", positionId);
      if (error) throw error;
      return data.map(pc => pc.course_id);
    },
    enabled: !!positionId,
  });

  const handleCourseToggle = async (courseId: string, isChecked: boolean) => {
    try {
      if (isChecked) {
        // Add course to position
        const { error } = await supabase
          .from("position_courses")
          .insert({
            position_id: positionId,
            course_id: courseId,
          });
        if (error) throw error;
      } else {
        // Remove course from position
        const { error } = await supabase
          .from("position_courses")
          .delete()
          .eq("position_id", positionId)
          .eq("course_id", courseId);
        if (error) throw error;
      }

      await refetchPositionCourses();
      toast({
        title: "Success",
        description: `Course ${isChecked ? "added to" : "removed from"} position`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1717] border-none text-white">
        <DialogHeader>
          <DialogTitle>Manage Courses for {positionName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoadingCourses ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            courses?.map((course) => (
              <div key={course.id} className="flex items-center space-x-2">
                <Checkbox
                  id={course.id}
                  checked={positionCourses?.includes(course.id)}
                  onCheckedChange={(checked) =>
                    handleCourseToggle(course.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={course.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {course.title}
                </label>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseManagementDialog;