import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Sales', path: '/sales', icon: ShoppingCart },
  { name: 'ML Predictions', path: '/predictions', icon: TrendingUp },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 hidden md:flex flex-col bg-card backdrop-blur-xl border-r border-white/5"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondaryAccent">
          SmartStock
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-accent/20 text-accent border border-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

    </motion.aside>
  );
};

export default Sidebar;
