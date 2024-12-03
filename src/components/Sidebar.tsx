import { useState } from 'react';
import { ChevronRight, Home, Book, Newspaper, Trophy, Settings, LogOut, User, Navigation2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Book, label: 'Courses', path: '/courses' },
    { icon: Book, label: 'E-Books', path: '/ebooks' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Trophy, label: 'Journey', path: '/journey' },
    { icon: Navigation2, label: 'Immersion', path: '/immersion' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "sidebar-transition h-screen bg-i2know-sidebar fixed left-0 top-0 z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex justify-between items-center">
          <img
            src={isCollapsed ? "https://i.ibb.co/W6FRw6H/i2know-1.png" : "https://i.ibb.co/Wt4MbD9/i2know.png"}
            alt="i2know logo"
            className={cn("transition-all duration-300", isCollapsed ? "w-12" : "w-32")}
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-i2know-text-secondary hover:text-i2know-text-primary transition-colors"
          >
            <ChevronRight className={cn("transition-transform duration-300", !isCollapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
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

        {/* Footer */}
        <div className="p-4 border-t border-i2know-card">
          <ul className="space-y-2">
            <li>
              <a
                href="/profile"
                className="flex items-center space-x-3 p-3 rounded-lg text-i2know-text-secondary hover:bg-i2know-card hover:text-i2know-text-primary transition-colors"
              >
                <User className={cn("w-6 h-6", isCollapsed && "w-8 h-8")} />
                {!isCollapsed && <span>Profile</span>}
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center space-x-3 p-3 rounded-lg text-i2know-text-secondary hover:bg-i2know-card hover:text-i2know-text-primary transition-colors"
              >
                <Settings className={cn("w-6 h-6", isCollapsed && "w-8 h-8")} />
                {!isCollapsed && <span>Settings</span>}
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-i2know-text-secondary hover:bg-i2know-card hover:text-i2know-text-primary transition-colors"
              >
                <LogOut className={cn("w-6 h-6", isCollapsed && "w-8 h-8")} />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;