export interface Task {
  id: number;
  title: string;
  description?: string;
  category?: string;
  dueTime?: string; // ISO string
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
}

export type TransactionType = 'obligation' | 'borrowed';

export interface Transaction {
  id: number;
  title: string; // e.g., "Internet Bill"
  amount: number;
  type: TransactionType;
  category?: string;
  notes?: string;
  isPaid: boolean;
  date: string; // YYYY-MM-DD (or YYYY-MM for monthly view context)
}

export interface Settings {
  salary: number;
  currency: string;
}
