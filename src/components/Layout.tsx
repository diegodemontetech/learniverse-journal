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
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-i2know-accent rounded-lg"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Sidebar with mobile support */}
      <div
        className={cn(
          "transition-transform duration-300 ease-in-out",
          isMobile && !isSidebarOpen && "-translate-x-full",
          "fixed left-0 top-0 z-40 h-screen"
        )}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content with responsive margin */}
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out relative text-i2know-text-primary",
          !isMobile && "ml-sidebar",
          "p-4 md:p-6"
        )}
      >
        {children}
        {!isHomePage && <Footer />}
      </main>
    </div>
  );
};

export default Layout;