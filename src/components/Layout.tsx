import { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-i2know-body">
      <Sidebar />
      <main className="ml-16 p-4 relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;