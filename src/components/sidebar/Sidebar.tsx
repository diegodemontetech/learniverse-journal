import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "h-screen bg-i2know-sidebar border-r border-i2know-accent/30",
      isMobile ? "w-[125px]" : "w-20", // Reduced from 250px to 125px for mobile
      "shadow-xl"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo - hidden on mobile since it's in the top bar */}
        {!isMobile && (
          <div className="p-4 flex justify-center items-center">
            <img
              src="https://i.ibb.co/W6FRw6H/i2know-1.png"
              alt="i2know logo"
              className="w-12 transition-all duration-300"
            />
          </div>
        )}

        <SidebarNavigation />
        
        {/* Footer with no margin on mobile */}
        <div className={cn(
          isMobile ? "mt-0" : "mt-auto"
        )}>
          <SidebarFooter />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;