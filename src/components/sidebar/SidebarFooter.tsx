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
    <div className="p-2 border-t border-i2know-card">
      <ul className="space-y-1">
        <li>
          <a
            href="/profile"
            className={cn(
              "flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
              "font-bold", // Made text bold
              !isCollapsed && "justify-start"
            )}
          >
            <User className="w-5 h-5 text-white" /> {/* Increased size by 30% and made white */}
            {!isCollapsed && <span className="leading-none text-white">Profile</span>} {/* Made text white */}
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className={cn(
              "flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
              "font-bold", // Made text bold
              !isCollapsed && "justify-start"
            )}
          >
            <Settings className="w-5 h-5 text-white" /> {/* Increased size by 30% and made white */}
            {!isCollapsed && <span className="leading-none text-white">Settings</span>} {/* Made text white */}
          </a>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
              "font-bold", // Made text bold
              !isCollapsed && "justify-start"
            )}
          >
            <LogOut className="w-5 h-5 text-white" /> {/* Increased size by 30% and made white */}
            {!isCollapsed && <span className="leading-none text-white">Logout</span>} {/* Made text white */}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarFooter;