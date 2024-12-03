import { useState } from 'react';
import { cn } from '@/lib/utils';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';
import { Compass, Bell, Grid2x2, UserCircle } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed] = useState(true);

  return (
    <div
      className={cn(
        "sidebar-transition h-screen bg-[#0f0f0f] fixed left-0 top-0 z-40 w-16 border-r border-gray-800/40"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center">
          <img
            src="https://i.ibb.co/W6FRw6H/i2know-1.png"
            alt="i2know logo"
            className="w-8"
          />
        </div>

        <SidebarNavigation />

        {/* Top right actions */}
        <div className="fixed top-4 right-4 flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Grid2x2 className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <UserCircle className="w-7 h-7 text-gray-400 hover:text-white cursor-pointer" />
        </div>

        <SidebarFooter />
      </div>
    </div>
  );
};

export default Sidebar;