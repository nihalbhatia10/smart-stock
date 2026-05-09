import { Info, RotateCcw, Download, CheckCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { resetData } = useStore();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data to default? This cannot be undone!")) {
      resetData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white">Project Information & Settings</h2>
        <p className="text-sm text-gray-400">Manage demo data and view project details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reset Data Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center mb-4 text-warning">
            <Database className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-bold text-white">Demo Data Management</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Instantly wipe all current local storage data and restore the system to its initial pristine state. Perfect for resetting the application before your Viva presentation.
          </p>
          <button 
            onClick={handleReset}
            className="w-full bg-warning/20 hover:bg-warning/30 text-warning font-medium py-3 rounded-xl transition-colors flex items-center justify-center border border-warning/20"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset Demo Data
          </button>
        </motion.div>

        {/* About Project Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center mb-4 text-accent">
            <Info className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-bold text-white">About Project</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              <strong className="text-white block mb-1">Objective:</strong>
              A modern Smart Inventory and Sales Prediction System built for second-year BSc IT mini project presentation.
            </p>
            <p>
              <strong className="text-white block mt-3 mb-1">Technologies Used:</strong>
              React, Vite, Tailwind CSS, Recharts, Framer Motion, Local Storage Context API.
            </p>
            <p>
              <strong className="text-white block mt-3 mb-1">Prediction Method:</strong>
              Dynamic Linear Regression modeled natively in JavaScript to calculate slopes and future trends directly from transaction history.
            </p>
            <div className="pt-4 border-t border-white/10 mt-4 flex items-center text-success font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Fully offline capable architecture
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
