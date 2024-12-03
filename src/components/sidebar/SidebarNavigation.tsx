import { Home, Tv, BookOpen, Newspaper, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Tv, label: 'Courses', path: '/courses' },
  { icon: BookOpen, label: 'E-Books', path: '/ebooks' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Trophy, label: 'Journey', path: '/journey' },
];

const SidebarNavigation = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <nav className="flex-1 px-2 mt-2">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.path}
              className={cn(
                "flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
                "font-bold",
                !isCollapsed && "justify-start"
              )}
            >
              <item.icon className="w-5 h-5 text-white" />
              {!isCollapsed && <span className="leading-none text-white">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;