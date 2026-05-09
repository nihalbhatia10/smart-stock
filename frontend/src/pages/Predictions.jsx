import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calculateLinearRegression } from '../utils/mlUtils';

const Predictions = () => {
  const { sales, inventory } = useStore();
  
  // Generate 30-day prediction based on sales
  const predictionResult = calculateLinearRegression(sales, 30);
  const predictionData = predictionResult.chartData;
  const trendPercent = (Math.abs(predictionResult.slope) / 100).toFixed(1); // naive percentage
  
  // Calculate inventory needs based on trend
  const criticalItems = inventory.filter(p => p.stock <= 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">ML Sales Predictions</h2>
          <p className="text-sm text-gray-400">AI-driven 30-day forecasting using Linear Regression</p>
        </div>
        <button className="w-full md:w-auto justify-center bg-secondaryAccent hover:bg-secondaryAccent/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Brain className="w-5 h-5 mr-2" />
          Model Active
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">30-Day Demand Forecast</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#ffffff20', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Actual Sales ($)" />
                <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" dot={false} name="ML Prediction ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`glass-card p-6 border-l-4 ${predictionResult.trend === 'down' ? 'border-l-danger' : 'border-l-success'}`}
          >
            <div className="flex items-center mb-2">
              {predictionResult.trend === 'down' ? (
                <TrendingDown className="w-5 h-5 text-danger mr-2" />
              ) : (
                <TrendingUp className="w-5 h-5 text-success mr-2" />
              )}
              <h4 className="text-white font-bold">Trend Analysis</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Based on your historical transaction data, the local regression model predicts a 
              <span className={`font-bold mx-1 ${predictionResult.trend === 'down' ? 'text-danger' : 'text-success'}`}>
                {trendPercent}% {predictionResult.trend === 'down' ? 'decrease' : 'increase'}
              </span> 
              in daily revenue over the next 30 days.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border-l-4 border-l-warning"
          >
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-warning mr-2" />
              <h4 className="text-white font-bold">Inventory Suggestions</h4>
            </div>
            {criticalItems.length === 0 ? (
              <p className="text-success text-sm mt-2">All stock levels are optimal right now.</p>
            ) : (
              <ul className="text-gray-400 text-sm space-y-2 mt-4">
                {criticalItems.map(item => (
                  <li key={item.id} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="text-warning whitespace-nowrap">Order +20 units</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
