import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { getUserRole } from '@/utils/auth';

const SidebarFooter = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const role = await getUserRole();
      setIsAdmin(role === 'admin');
    };
    checkAdminStatus();
  }, []);

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
    <div className={cn(
      "border-t border-gray-800/30",
      isMobile ? "p-2" : "p-4"
    )}>
      <ul className={cn(
        "space-y-2",
        isMobile && "flex flex-col items-start gap-2"
      )}>
        <li>
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg text-white hover:bg-gray-800 transition-colors",
              isMobile && "text-sm"
            )}
          >
            <User className="w-5 h-5" />
            {isMobile && <span>Perfil</span>}
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg text-white hover:bg-gray-800 transition-colors",
                isMobile && "text-sm"
              )}
            >
              <Settings className="w-5 h-5" />
              {isMobile && <span>Configurações</span>}
            </Link>
          </li>
        )}
        <li>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-lg text-white hover:bg-gray-800 transition-colors",
              isMobile && "text-sm"
            )}
          >
            <LogOut className="w-5 h-5" />
            {isMobile && <span>Sair</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarFooter;