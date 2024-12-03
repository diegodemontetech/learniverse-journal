import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "w-20 h-screen bg-i2know-sidebar border-r border-i2know-accent/30",
      isMobile ? "w-[250px]" : "w-20"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex justify-center items-center">
          <img
            src="https://i.ibb.co/W6FRw6H/i2know-1.png"
            alt="i2know logo"
            className={cn(
              "transition-all duration-300",
              isMobile ? "w-32" : "w-12"
            )}
          />
        </div>

        <SidebarNavigation />
        <SidebarFooter />
      </div>
    </div>
  );
};

export default Sidebar;