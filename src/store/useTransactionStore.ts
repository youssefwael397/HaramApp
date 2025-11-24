import { create } from 'zustand';
import { Transaction, Settings } from '../domain/models';
import { TransactionRepository } from '../data/repositories/TransactionRepository';
import { SettingsRepository } from '../data/repositories/SettingsRepository';
import { format } from 'date-fns';

interface TransactionState {
  transactions: Transaction[];
  salary: number;
  currentMonth: string; // YYYY-MM
  isLoading: boolean;
  loadData: (month?: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'isPaid' | 'date'>) => void;
  updateSalary: (amount: number) => void;
  togglePaid: (id: number, currentStatus: boolean) => void;
  deleteTransaction: (id: number) => void;
  
  // Computed
  totalObligations: number;
  totalBorrowed: number;
  remainingSalary: number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  salary: 0,
  currentMonth: format(new Date(), 'yyyy-MM'),
  isLoading: false,
  totalObligations: 0,
  totalBorrowed: 0,
  remainingSalary: 0,

  loadData: (month = get().currentMonth) => {
    set({ isLoading: true, currentMonth: month });
    try {
      const settings = SettingsRepository.getSettings();
      const txs = TransactionRepository.getTransactionsByMonth(month);
      
      const salary = settings?.salary || 0;
      
      // Calculate totals
      const obligations = txs
        .filter(t => t.type === 'obligation')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const borrowed = txs
        .filter(t => t.type === 'borrowed')
        .reduce((sum, t) => sum + t.amount, 0);

      set({
        transactions: txs,
        salary,
        isLoading: false,
        totalObligations: obligations,
        totalBorrowed: borrowed,
        remainingSalary: salary - obligations - borrowed,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  addTransaction: (txData) => {
    const { currentMonth } = get();
    // Default to first day of month for sorting, or current date if current month
    const date = `${currentMonth}-01`; 
    
    const newTx = {
      ...txData,
      isPaid: false,
      date: date, // Simplified for monthly view
    };
    TransactionRepository.addTransaction(newTx);
    get().loadData(currentMonth);
  },

  updateSalary: (amount) => {
    SettingsRepository.updateSalary(amount);
    get().loadData();
  },

  togglePaid: (id, currentStatus) => {
    const { transactions, currentMonth } = get();
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      TransactionRepository.updateTransaction({ ...tx, isPaid: !currentStatus });
      get().loadData(currentMonth);
    }
  },

  deleteTransaction: (id) => {
    const { currentMonth } = get();
    TransactionRepository.deleteTransaction(id);
    get().loadData(currentMonth);
  },
}));
