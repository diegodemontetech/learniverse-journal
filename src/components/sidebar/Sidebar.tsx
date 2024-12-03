import { cn } from '@/lib/utils';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  return (
    <div className="w-20 h-screen bg-[#1a1717] fixed left-0 top-0 z-40 border-r border-gray-800/30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex justify-center items-center">
          <img
            src="https://i.ibb.co/W6FRw6H/i2know-1.png"
            alt="i2know logo"
            className="w-12"
          />
        </div>

        <SidebarNavigation />
        <SidebarFooter />
      </div>
    </div>
  );
};

export default Sidebar;