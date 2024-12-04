import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface CourseFormProps {
  course?: any;
  onSuccess: () => void;
}

const CourseForm = ({ course, onSuccess }: CourseFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      instructor: course?.instructor || "",
      duration: course?.duration || "",
      category_id: course?.category_id || "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (course) {
        // Update existing course
        const { error } = await supabase
          .from("courses")
          .update({
            title: data.title,
            description: data.description,
            instructor: data.instructor,
            duration: data.duration,
            category_id: data.category_id,
          })
          .eq("id", course.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        // Create new course
        const { error } = await supabase
          .from("courses")
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Course Title"
          {...register("title", { required: true })}
          className="bg-[#2a2727] border-none text-white"
        />
      </div>
      <div>
        <Textarea
          placeholder="Course Description"
          {...register("description")}
          className="bg-[#2a2727] border-none text-white min-h-[100px]"
        />
      </div>
      <div>
        <Input
          placeholder="Instructor Name"
          {...register("instructor", { required: true })}
          className="bg-[#2a2727] border-none text-white"
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Duration (minutes)"
          {...register("duration", { required: true })}
          className="bg-[#2a2727] border-none text-white"
        />
      </div>
      <div>
        <select
          {...register("category_id", { required: true })}
          className="w-full bg-[#2a2727] border-none text-white rounded-md p-2"
        >
          <option value="">Select Category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-i2know-accent hover:bg-i2know-accent/90"
      >
        {course ? "Update Course" : "Create Course"}
      </Button>
    </form>
  );
};

export default CourseForm;