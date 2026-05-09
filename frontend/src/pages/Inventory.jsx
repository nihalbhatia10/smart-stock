import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { inventory, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', sku: '', stock: 0, price: 0, category: ''
  });

  const getStatus = (stock) => {
    if (stock <= 5) return 'Critical';
    if (stock <= 15) return 'Low Stock';
    return 'In Stock';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(inventory.map(i => i.category))];

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData(product);
    } else {
      setEditingId(null);
      setFormData({ name: '', sku: '', stock: 0, price: 0, category: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.category) {
      toast.error('Please fill in all text fields');
      return;
    }
    
    const formattedData = {
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price)
    };

    if (editingId) {
      updateProduct(editingId, formattedData);
    } else {
      addProduct(formattedData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
          <p className="text-sm text-gray-400">Manage your product catalog and stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              import('../utils/exportUtils').then(module => {
                module.exportToCSV(inventory, 'inventory_report');
                toast.success('Inventory exported!');
              });
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center border border-white/10"
          >
            Export CSV
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex w-full sm:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-4 text-sm text-gray-300 focus:outline-none focus:border-accent"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm border-b border-white/5">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">No products found.</td>
                </tr>
              ) : filteredInventory.map((item) => {
                const status = getStatus(item.stock);
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-gray-300">
                    <td className="p-4 font-medium text-white">{item.name}</td>
                    <td className="p-4">{item.sku}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">${Number(item.price).toFixed(2)}</td>
                    <td className="p-4">{item.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        status === 'In Stock' ? 'bg-success/20 text-success' :
                        status === 'Low Stock' ? 'bg-warning/20 text-warning' :
                        'bg-danger/20 text-danger'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-accent transition-colors bg-white/5 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-danger transition-colors bg-white/5 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
            <input 
              type="text" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. Wireless Mouse"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
              <input 
                type="text" required
                value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
                placeholder="e.g. WM-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input 
                type="text" required
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
                placeholder="e.g. Electronics"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
              <input 
                type="number" step="0.01" min="0" required
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Initial Stock</label>
              <input 
                type="number" min="0" required
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-xl font-medium transition-colors">
              {editingId ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
