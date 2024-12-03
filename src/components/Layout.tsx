import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-i2know-body relative">
      <Sidebar />
      <main className="ml-sidebar p-4 relative text-i2know-text-primary">
        {children}
        {!isHomePage && <Footer />}
      </main>
    </div>
  );
};

export default Layout;