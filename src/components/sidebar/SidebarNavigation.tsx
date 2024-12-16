import { Home, Tv, BookOpen, Megaphone, Trophy, FlagTriangleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getUserRole } from '@/utils/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: Home, label: 'Início', path: '/', requiredRole: null },
  { icon: Tv, label: 'Cursos', path: '/courses', requiredRole: null },
  { icon: BookOpen, label: 'E-Books', path: '/ebooks', requiredRole: null },
  { icon: Megaphone, label: 'Notícias', path: '/news', requiredRole: null },
  { icon: Trophy, label: 'Jornada', path: '/journey', requiredRole: null },
  { icon: FlagTriangleRight, label: 'Imersão', path: '/immersion', requiredRole: null },
];

const SidebarNavigation = () => {
  const isMobile = useIsMobile();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchUserRole();
  }, []);

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    // If no role is required, show the item
    if (!item.requiredRole) return true;
    // If a role is required, check if user has that role
    return userRole === item.requiredRole;
  });

  return (
    <nav className={cn(
      "flex-1",
      isMobile ? "py-2" : "px-3 py-6"
    )}>
      <ul className={cn(
        "space-y-1",
        isMobile && "px-2"
      )}>
        {visibleMenuItems.map((item) => (
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