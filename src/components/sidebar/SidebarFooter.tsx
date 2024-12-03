import { Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SidebarFooter = () => {
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
    <div className="p-2 mt-auto">
      <ul className="space-y-1">
        <li>
          <a
            href="/profile"
            className="flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-white transition-colors relative group"
          >
            <User className="w-5 h-5" />
            <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className="flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-white transition-colors relative group"
          >
            <Settings className="w-5 h-5" />
            <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Settings
            </span>
          </a>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-white transition-colors relative group"
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Logout
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarFooter;