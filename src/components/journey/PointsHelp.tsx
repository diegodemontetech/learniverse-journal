import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HelpCircle } from "lucide-react";

const PointsHelp = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
          Como ganhar pontos?
          <HelpCircle className="w-4 h-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Sistema de Pontuação</h4>
          <ul className="text-sm space-y-1">
            <li>• Login diário: 1 ponto</li>
            <li>• Cada 20 páginas de e-book: 10 pontos</li>
            <li>• Aula assistida: 10 pontos</li>
            <li>• Notícia lida: 3 pontos</li>
            <li>• Comentário: 1 ponto</li>
            <li>• Curso completo: 50 pontos + (10 × nota do quiz)</li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PointsHelp;