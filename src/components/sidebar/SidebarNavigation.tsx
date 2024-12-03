import { Home, Tv, BookOpen, Megaphone, Trophy, FlagTriangleRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Tv, label: 'Courses', path: '/courses' },
  { icon: BookOpen, label: 'E-Books', path: '/ebooks' },
  { icon: Megaphone, label: 'News', path: '/news' },
  { icon: Trophy, label: 'Journey', path: '/journey' },
  { icon: FlagTriangleRight, label: 'Immersion', path: '/immersion' },
];

const SidebarNavigation = () => {
  return (
    <nav className="flex-1 px-3 py-6">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.path}
              className="flex items-center justify-center p-2 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-6 h-6" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;