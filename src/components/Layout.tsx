import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './sidebar/Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-i2know-body relative">
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-i2know-sidebar z-40 flex items-center justify-between px-4 shadow-lg">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-i2know-accent rounded-lg hover:bg-i2know-accent/80 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          
          <img
            src="https://i.ibb.co/W6FRw6H/i2know-1.png"
            alt="i2know logo"
            className="h-8"
          />
          
          {/* Empty div to maintain center alignment */}
          <div className="w-11"></div>
        </div>
      )}

      {/* Sidebar with mobile support */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out",
          isMobile && !isSidebarOpen && "-translate-x-full",
          isMobile && isSidebarOpen && "translate-x-0",
          "shadow-xl"
        )}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content with responsive margin */}
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out relative text-i2know-text-primary",
          !isMobile && "ml-sidebar",
          isMobile && "ml-0",
          "p-4 md:p-6",
          // Add top margin for mobile to account for the top bar
          isMobile && "mt-16"
        )}
      >
        {children}
        {!isHomePage && <Footer />}
      </main>
    </div>
  );
};

export default Layout;