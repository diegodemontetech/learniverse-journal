import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-i2know-body">
      <Sidebar />
      <main className="content-transition ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;