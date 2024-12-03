import { Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  const navigate = useNavigate();

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
  );
};

export default SidebarFooter;