import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Package, ShoppingCart, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../context/StoreContext';
import { calculateLinearRegression } from '../utils/mlUtils';

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = '' }) => {
  const spring = useSpring(0, { mass: 1, stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => 
    prefix + current.toLocaleString('en-US', { maximumFractionDigits: 0 })
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

const StatCard = ({ title, value, prefix, icon: Icon, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">
          <AnimatedCounter value={value} prefix={prefix} />
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { inventory, sales } = useStore();

  // Derived Stats
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = sales.length;
  const totalProducts = inventory.reduce((sum, p) => sum + p.stock, 0);
  const criticalItems = inventory.filter(p => p.stock <= 5);

  // Prediction Data
  const predictionData = calculateLinearRegression(sales, 10).chartData.slice(-15); // Show last 5 days + next 10 days

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={totalRevenue} prefix="$" icon={TrendingUp} colorClass="bg-accent" />
        <StatCard title="Active Inventory" value={totalProducts} prefix="" icon={Package} colorClass="bg-secondaryAccent" />
        <StatCard title="Total Transactions" value={totalSales} prefix="" icon={ShoppingCart} colorClass="bg-success" />
        <StatCard title="Critical Stock Alerts" value={criticalItems.length} prefix="" icon={AlertCircle} colorClass="bg-warning" />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue vs ML Predictions</h3>
              <p className="text-sm text-gray-400">Current actuals mapped against linear forecasting</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#6b7280" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" name="Actual ($)" />
                <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Prediction ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts / Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 overflow-y-auto max-h-[400px]"
        >
          <h3 className="text-lg font-bold text-white mb-6">Stock Alerts</h3>
          <div className="space-y-4">
            {criticalItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">No critical alerts. Stock is healthy.</p>
            ) : criticalItems.map((item, i) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                <div className="p-2 rounded-lg bg-danger/20 text-danger">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Critical: {item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">Only {item.stock} left. Restock immediately.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
