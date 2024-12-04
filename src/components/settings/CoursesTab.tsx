import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CourseList from "./course/CourseList";
import CourseForm from "./course/CourseForm";

const CoursesTab = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const { data: courses, refetch: refetchCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          categories(name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const openEditDialog = (course: any) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Courses</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-i2know-accent hover:bg-i2know-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1717] border-none text-white">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm
              onSuccess={() => {
                setIsAddDialogOpen(false);
                refetchCourses();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CourseList
        courses={courses || []}
        onEdit={openEditDialog}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1a1717] border-none text-white">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <CourseForm
            course={selectedCourse}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setSelectedCourse(null);
              refetchCourses();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesTab;