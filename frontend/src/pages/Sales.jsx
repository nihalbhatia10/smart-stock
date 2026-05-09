import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const Sales = () => {
  const { sales, inventory, recordSale } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // POS State
  const [customer, setCustomer] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    if (!selectedProduct) return toast.error('Select a product');
    const product = inventory.find(p => p.id === selectedProduct);
    if (!product) return;
    if (quantity > product.stock) return toast.error(`Only ${product.stock} left in stock`);

    const existing = cart.find(item => item.productId === selectedProduct);
    if (existing) {
      if (existing.qty + quantity > product.stock) return toast.error(`Cannot exceed stock limit of ${product.stock}`);
      setCart(cart.map(item => item.productId === selectedProduct ? { ...item, qty: item.qty + quantity } : item));
    } else {
      setCart([...cart, { productId: selectedProduct, name: product.name, price: product.price, qty: quantity }]);
    }
    toast.success('Added to cart');
    setQuantity(1);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (!customer) return toast.error('Enter customer name');
    if (cart.length === 0) return toast.error('Cart is empty');
    
    const items = cart.map(item => ({ productId: item.productId, qty: item.qty }));
    const success = recordSale(customer, items);
    
    if (success) {
      setIsModalOpen(false);
      setCart([]);
      setCustomer('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Sales & Transactions</h2>
          <p className="text-sm text-gray-400">Record new sales and view transaction history</p>
        </div>
        <div className="flex w-full md:w-auto space-x-3">
          <button 
            onClick={() => {
              import('../utils/exportUtils').then(module => {
                const flatSales = sales.map(s => ({
                  ID: s.id,
                  Date: new Date(s.date).toLocaleString(),
                  Customer: s.customer,
                  ItemsCount: s.items.reduce((sum, i) => sum + i.qty, 0),
                  TotalAmount: s.total.toFixed(2)
                }));
                module.exportToCSV(flatSales, 'sales_report');
                toast.success('Sales exported!');
              });
            }}
            className="flex-1 justify-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center border border-white/10"
          >
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 justify-center bg-success hover:bg-success/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Sale (POS)
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mt-8 mb-4">Transaction History</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales.length === 0 ? (
          <p className="text-gray-500">No sales recorded yet.</p>
        ) : sales.map((sale, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={sale.id} 
            className="glass-card p-5 border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-accent px-2 py-1 bg-accent/10 rounded-md">{sale.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success uppercase font-bold tracking-wider">
                Completed
              </span>
            </div>
            <h4 className="text-white font-bold text-lg mb-1">{sale.customer}</h4>
            <div className="text-xs text-gray-400 mb-4">
              <p>{new Date(sale.date).toLocaleString()}</p>
              <p>{sale.items.reduce((sum, item) => sum + item.qty, 0)} items purchased</p>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm text-gray-400">Total</span>
              <span className="text-xl font-bold text-success">${sale.total.toFixed(2)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Point of Sale (Checkout)">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
            <input 
              type="text" 
              value={customer} onChange={e => setCustomer(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Product</label>
              <select 
                value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              >
                <option value="">-- Choose Product --</option>
                {inventory.filter(p => p.stock > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price}) - {p.stock} left</option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-300 mb-1">Qty</label>
              <input 
                type="number" min="1" 
                value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-end pb-0.5">
              <button onClick={addToCart} className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 bg-black/30 rounded-xl p-4 border border-white/5 min-h-[150px]">
            <h4 className="text-sm font-medium text-gray-400 mb-3 border-b border-white/10 pb-2">Cart Summary</h4>
            {cart.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Cart is empty</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-gray-300">
                    <span>{item.qty}x {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-white">Grand Total</span>
                <span className="font-bold text-accent text-lg">${cartTotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleCheckout} className="bg-success hover:bg-success/90 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Complete Checkout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sales;
