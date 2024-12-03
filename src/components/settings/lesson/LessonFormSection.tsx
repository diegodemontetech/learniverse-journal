import { useState } from "react";
import LessonForm from "./LessonForm";
import SupportMaterialUpload from "./SupportMaterialUpload";
import SupportMaterialList from "./SupportMaterialList";

interface LessonFormSectionProps {
  selectedCourse: string | null;
  isEditing: boolean;
  editingLesson: any;
  formData: {
    title: string;
    description: string;
    youtubeUrl: string;
    duration: string;
    orderNumber: string;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (field: string, value: string) => void;
  onCancel: () => void;
  onUploadComplete: () => void;
}

const LessonFormSection = ({
  selectedCourse,
  isEditing,
  editingLesson,
  formData,
  onSubmit,
  onChange,
  onCancel,
  onUploadComplete,
}: LessonFormSectionProps) => {
  return (
    <div className="space-y-6">
      <LessonForm
        isEditing={isEditing}
        lessonId={editingLesson?.id || null}
        {...formData}
        onSubmit={onSubmit}
        onChange={onChange}
        onCancel={onCancel}
        onUploadComplete={onUploadComplete}
      />

      {editingLesson && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Materiais de Apoio</h3>
          <SupportMaterialUpload
            lessonId={editingLesson.id}
            onUploadComplete={onUploadComplete}
          />
          <SupportMaterialList lessonId={editingLesson.id} />
        </div>
      )}
    </div>
  );
};

export default LessonFormSection;