import { Bell, Search, User, Menu } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="h-20 bg-card/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center flex-1 space-x-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search inventory, sales, or reports..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4 lg:space-x-6">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-white/10 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondaryAccent flex items-center justify-center text-white font-bold group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
            AD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
