import { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-i2know-body">
      <Sidebar />
      <main className="ml-sidebar p-4 relative z-0">
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;