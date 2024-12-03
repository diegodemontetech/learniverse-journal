import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="p-4 border-t border-gray-800">
      <ul className="space-y-2">
        <li>
          <Link
            to="/profile"
            className="flex items-center justify-center p-3 rounded-lg text-white hover:bg-gray-800 transition-colors"
          >
            <User className="w-8 h-8" />
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="flex items-center justify-center p-3 rounded-lg text-white hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-8 h-8" />
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-lg text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-8 h-8" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarFooter;