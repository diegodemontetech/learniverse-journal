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
import { supabase } from '@/integrations/supabase/client';

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
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Get user role
      const role = await getUserRole();
      setUserRole(role);

      // Get user profile and groups
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('group_id, department_id, position_id')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);

        if (profile?.group_id) {
          const { data: groups } = await supabase
            .from('user_groups')
            .select('course_access')
            .eq('id', profile.group_id);
          setUserGroups(groups || []);
        }
      }
    };

    fetchUserData();
  }, []);

  // Filter menu items based on user permissions
  const visibleMenuItems = menuItems.filter(item => {
    // If no role is required, show the item
    if (!item.requiredRole) {
      // For courses and immersion, check additional permissions
      if (item.path === '/courses' || item.path === '/immersion') {
        // Admin can see everything
        if (userRole === 'admin') return true;

        // For regular users, check group permissions
        if (userGroups.length > 0) {
          // Check if user has access to any courses
          return userGroups.some(group => 
            group.course_access && group.course_access.length > 0
          );
        }
        return false;
      }
      
      // For settings page, only show for admins
      if (item.path === '/settings') {
        return userRole === 'admin';
      }

      // For other items with no required role, show them
      return true;
    }

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