import { Home, Tv, BookOpen, Megaphone, Trophy, FlagTriangleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  return (
    <nav className="flex-1 px-3 py-6">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
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
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;