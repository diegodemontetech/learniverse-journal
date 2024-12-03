import { Home, Book, Newspaper, Trophy, Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Book, label: 'Courses', path: '/courses' },
  { icon: Book, label: 'E-Books', path: '/ebooks' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Trophy, label: 'Journey', path: '/journey' },
  { icon: Navigation2, label: 'Immersion', path: '/immersion' },
];

const SidebarNavigation = () => {
  return (
    <nav className="flex-1 px-4 py-6">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.path}
              className="flex items-center justify-center p-3 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-8 h-8" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;