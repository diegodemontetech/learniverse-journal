import React from "react";
import { Button } from "@/components/ui/button";

interface LessonTableProps {
  lessons: any[];
  onEdit: (lesson: any) => void;
  onDelete: (id: string) => void;
}

const LessonTable: React.FC<LessonTableProps> = ({ lessons, onEdit, onDelete }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {lessons.map((lesson) => (
          <tr key={lesson.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Button variant="link" onClick={() => onEdit(lesson)}>Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(lesson.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LessonTable;
