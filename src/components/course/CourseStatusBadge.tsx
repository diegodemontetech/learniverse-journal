import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, Sparkles } from "lucide-react";

type CourseStatus = "new" | "in_progress" | "completed";

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

const CourseStatusBadge = ({ status }: CourseStatusBadgeProps) => {
  const statusConfig = {
    new: {
      label: "Novo",
      icon: Sparkles,
      className: "bg-blue-500 hover:bg-blue-600",
    },
    in_progress: {
      label: "Em Andamento",
      icon: Timer,
      className: "bg-yellow-500 hover:bg-yellow-600",
    },
    completed: {
      label: "Concluído",
      icon: Trophy,
      className: "bg-green-500 hover:bg-green-600",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.className} gap-1 absolute top-2 right-2 z-10`}>
      <config.icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default CourseStatusBadge;