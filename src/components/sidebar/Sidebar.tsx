import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

        <SidebarNavigation isCollapsed={isCollapsed} />
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;