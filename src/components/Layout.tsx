import { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Sidebar />
      <main className="ml-16 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;