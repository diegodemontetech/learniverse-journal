import { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-i2know-body">
      <Sidebar />
      <main className="content-transition ml-12 p-8"> {/* Adjusted margin for collapsed state */}
        {children}
      </main>
    </div>
  );
};

export default Layout;