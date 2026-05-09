import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-auto pt-8 pb-2 text-center text-xs text-gray-500 border-t border-white/5">
            SmartStock System © 2026 | Developed by Nihal Bhatia & Team
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
