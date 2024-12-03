import { Home, Book, Newspaper, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Book, label: 'Courses', path: '/courses' },
  { icon: Book, label: 'E-Books', path: '/ebooks' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Trophy, label: 'Journey', path: '/journey' },
];

const SidebarNavigation = ({ isCollapsed }: SidebarNavigationProps) => {
  return (
    <nav className="flex-1 px-4 py-6">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg text-i2know-text-secondary hover:bg-i2know-card hover:text-i2know-text-primary transition-colors"
            >
              <item.icon className={cn("w-6 h-6", isCollapsed && "w-8 h-8")} />
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;