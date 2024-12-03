import { Home, Tv, BookOpen, Megaphone, Trophy, FlagTriangleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: Tv, label: 'Cursos', path: '/courses' },
  { icon: BookOpen, label: 'E-Books', path: '/ebooks' },
  { icon: Megaphone, label: 'Notícias', path: '/news' },
  { icon: Trophy, label: 'Jornada', path: '/journey' },
  { icon: FlagTriangleRight, label: 'Imersão', path: '/immersion' },
];

const SidebarNavigation = () => {
  const isMobile = useIsMobile();

  return (
    <nav className={cn(
      "flex-1",
      isMobile ? "py-2" : "px-3 py-6"
    )}>
      <ul className={cn(
        "space-y-1",
        isMobile && "px-2"
      )}>
        {menuItems.map((item) => (
          <li key={item.label}>
            {isMobile ? (
              <Link
                to={item.path}
                className="flex items-center gap-3 p-2 rounded-lg text-white hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className="flex items-center justify-center p-2 rounded-lg text-white hover:bg-gray-800 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;