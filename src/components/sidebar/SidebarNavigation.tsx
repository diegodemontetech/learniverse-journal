import { Home, Tv, BookOpen, Newspaper, Trophy, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: Compass, label: 'Discover', path: '/' },
  { icon: Tv, label: 'Courses', path: '/courses' },
  { icon: BookOpen, label: 'E-Books', path: '/ebooks' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Trophy, label: 'Journey', path: '/journey' },
];

const SidebarNavigation = () => {
  const location = useLocation();

  return (
    <nav className="flex-1 px-2 mt-2">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.label}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg transition-colors relative group",
                  isActive 
                    ? "text-white" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                
                {/* Tooltip */}
                <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;