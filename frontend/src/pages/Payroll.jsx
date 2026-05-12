import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Check, Briefcase, UserPlus, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { exportToCSV } from '../utils/exportUtils';

const Payroll = () => {
  const { employees, payroll, recordPayroll, addEmployee } = useStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  
  // Payment State
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Employee State
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empSalary, setEmpSalary] = useState('');

  const handlePayment = () => {
    if (!selectedEmployee) return toast.error('Select an employee');
    if (!amount || amount <= 0) return toast.error('Enter a valid amount');
    
    recordPayroll(selectedEmployee, Number(amount), notes);
    
    setIsPaymentModalOpen(false);
    setSelectedEmployee('');
    setAmount('');
    setNotes('');
  };

  const handleAddEmployee = () => {
    if (!empName) return toast.error('Enter employee name');
    if (!empRole) return toast.error('Enter employee role');
    if (!empSalary || empSalary <= 0) return toast.error('Enter a valid salary');
    
    addEmployee({ name: empName, role: empRole, salary: Number(empSalary) });
    
    setIsEmployeeModalOpen(false);
    setEmpName('');
    setEmpRole('');
    setEmpSalary('');
  };

  const handleExport = () => {
    if (payroll.length === 0) {
      return toast.error('No payroll records to export');
    }
    const exportData = payroll.map(p => {
      const emp = employees.find(e => e.id === p.employeeId);
      return {
        'Record ID': p.id,
        'Date': new Date(p.date).toLocaleString(),
        'Employee ID': p.employeeId,
        'Employee Name': emp ? emp.name : 'Unknown',
        'Amount ($)': p.amount,
        'Notes': p.notes || ''
      };
    });
    exportToCSV(exportData, 'payroll_records');
    toast.success('Payroll exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Employee Payroll</h2>
          <p className="text-sm text-gray-400">Manage your employees and record salary payments</p>
        </div>
        <div className="flex flex-wrap w-full md:w-auto gap-3">
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none justify-center bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setIsEmployeeModalOpen(true)}
            className="flex-1 md:flex-none justify-center bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Employee
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full md:w-auto justify-center bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees List */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-accent" />
            Employees
          </h3>
          <div className="space-y-3">
            {employees.length === 0 ? (
              <p className="text-gray-500">No employees added yet.</p>
            ) : employees.map((emp, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={emp.id} 
                className="glass-card p-4 border border-white/5 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{emp.name}</h4>
                    <p className="text-xs text-gray-400">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">${emp.salary}/mo</span>
                  <p className="text-[10px] text-gray-500">{emp.id}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payroll History */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-success" />
            Payment History
          </h3>
          <div className="space-y-3">
            {payroll.length === 0 ? (
              <p className="text-gray-500">No payroll records yet.</p>
            ) : payroll.map((pay, i) => {
              const emp = employees.find(e => e.id === pay.employeeId);
              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={pay.id} 
                  className="glass-card p-4 border border-white/5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-bold">{emp ? emp.name : 'Unknown Employee'}</h4>
                      <p className="text-xs text-gray-400">{new Date(pay.date).toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-bold text-success">+${pay.amount.toFixed(2)}</span>
                  </div>
                  {pay.notes && (
                    <p className="text-xs text-gray-500 bg-black/20 p-2 rounded-md mt-2">
                      {pay.notes}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Payroll Payment">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Select Employee</label>
            <select 
              value={selectedEmployee} onChange={e => {
                setSelectedEmployee(e.target.value);
                const emp = employees.find(emp => emp.id === e.target.value);
                if (emp) setAmount(emp.salary);
              }}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
            <input 
              type="number" min="0" step="0.01"
              value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. 4500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes / Description</label>
            <input 
              type="text" 
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. May Salary"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handlePayment} className="bg-success hover:bg-success/90 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Confirm Payment
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} title="Add New Employee">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Employee Name</label>
            <input 
              type="text" 
              value={empName} onChange={e => setEmpName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role / Position</label>
            <input 
              type="text" 
              value={empRole} onChange={e => setEmpRole(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. Sales Associate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base Salary ($)</label>
            <input 
              type="number" min="0" step="0.01"
              value={empSalary} onChange={e => setEmpSalary(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent"
              placeholder="e.g. 3500"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button onClick={() => setIsEmployeeModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleAddEmployee} className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payroll;
