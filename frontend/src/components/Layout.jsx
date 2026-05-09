import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 lg:p-8 flex flex-col">
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
