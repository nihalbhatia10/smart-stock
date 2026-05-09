import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const StoreContext = createContext();

const initialInventory = [
  { id: '1', name: 'Wireless Earbuds', sku: 'WE-001', stock: 45, price: 59.99, category: 'Electronics' },
  { id: '2', name: 'Smart Watch', sku: 'SW-002', stock: 12, price: 129.99, category: 'Electronics' },
  { id: '3', name: 'Ergonomic Chair', sku: 'EC-003', stock: 5, price: 199.99, category: 'Furniture' },
  { id: '4', name: 'Mechanical Keyboard', sku: 'MK-004', stock: 89, price: 89.99, category: 'Electronics' },
];

const initialSales = [
  { id: 'INV-1001', date: '2026-10-24T10:00:00Z', customer: 'Alice Johnson', items: [{ productId: '1', qty: 2 }], total: 119.98 },
  { id: 'INV-1002', date: '2026-10-24T14:30:00Z', customer: 'Bob Smith', items: [{ productId: '2', qty: 1 }], total: 129.99 },
  { id: 'INV-1003', date: '2026-10-23T09:15:00Z', customer: 'Charlie Davis', items: [{ productId: '3', qty: 1 }], total: 199.99 },
];

export const StoreProvider = ({ children }) => {
  const [inventory, setInventory] = useState(() => {
    const localData = localStorage.getItem('smartstock_inventory');
    return localData ? JSON.parse(localData) : initialInventory;
  });

  const [sales, setSales] = useState(() => {
    const localData = localStorage.getItem('smartstock_sales');
    return localData ? JSON.parse(localData) : initialSales;
  });

  useEffect(() => {
    localStorage.setItem('smartstock_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('smartstock_sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setInventory([...inventory, newProduct]);
    toast.success('Product added successfully!');
  };

  const updateProduct = (id, updatedProduct) => {
    setInventory(inventory.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    toast.success('Product updated!');
  };

  const deleteProduct = (id) => {
    setInventory(inventory.filter(p => p.id !== id));
    toast.success('Product deleted!');
  };

  const recordSale = (customer, items) => {
    // items = [{ productId, qty }]
    let total = 0;
    
    // Check stock first
    for (let item of items) {
      const product = inventory.find(p => p.id === item.productId);
      if (!product || product.stock < item.qty) {
        toast.error(`Not enough stock for ${product?.name || 'Unknown Product'}`);
        return false;
      }
      total += product.price * item.qty;
    }

    // Deduct stock
    const newInventory = inventory.map(p => {
      const saleItem = items.find(i => i.productId === p.id);
      if (saleItem) {
        return { ...p, stock: p.stock - saleItem.qty };
      }
      return p;
    });

    const newSale = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      customer,
      items,
      total
    };

    setInventory(newInventory);
    setSales([newSale, ...sales]);
    toast.success('Sale recorded successfully!');
    return true;
  };

  const resetData = () => {
    setInventory(initialInventory);
    setSales(initialSales);
    toast.success('All demo data restored to defaults!');
  };

  return (
    <StoreContext.Provider value={{
      inventory, addProduct, updateProduct, deleteProduct,
      sales, recordSale, resetData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
