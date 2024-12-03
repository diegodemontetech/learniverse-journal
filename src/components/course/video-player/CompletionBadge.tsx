import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface CompletionBadgeProps {
  isCompleted: boolean;
}

const CompletionBadge = ({ isCompleted }: CompletionBadgeProps) => {
  if (!isCompleted) return null;

  return (
    <Badge className="absolute top-4 right-4 bg-green-500 gap-1 z-10">
      <CheckCircle className="w-4 h-4" />
      Concluído
    </Badge>
  );
};

export default CompletionBadge;