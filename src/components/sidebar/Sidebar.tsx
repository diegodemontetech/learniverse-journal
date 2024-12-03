import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed

  return (
    <div
      className={cn(
        "sidebar-transition h-screen bg-[#1a1717] fixed left-0 top-0 z-40",
        isCollapsed ? "w-12" : "w-40" // Reduced width by 40%
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo - Moved up and reduced size */}
        <div className="p-2 flex justify-between items-center">
          <img
            src={isCollapsed ? "https://i.ibb.co/W6FRw6H/i2know-1.png" : "https://i.ibb.co/Wt4MbD9/i2know.png"}
            alt="i2know logo"
            className={cn("transition-all duration-300", isCollapsed ? "w-8" : "w-24")}
          />
        </div>

        <SidebarNavigation isCollapsed={isCollapsed} />
        <SidebarFooter isCollapsed={isCollapsed} />

        {/* Collapse button circle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-12 bg-[#1a1717] rounded-full p-1.5 shadow-md border border-gray-800",
            "hover:bg-gray-800 transition-colors"
          )}
        >
          <ChevronRight 
            className={cn(
              "w-3 h-3 text-gray-400 transition-transform duration-300",
              !isCollapsed && "rotate-180"
            )} 
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;