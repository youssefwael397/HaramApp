import { db } from '../db';
import { Transaction } from '../../domain/models';

export const TransactionRepository = {
  getTransactionsByMonth: (month: string): Transaction[] => {
    // month format: YYYY-MM
    try {
      const result = db.getAllSync<Transaction>(
        'SELECT * FROM transactions WHERE date LIKE ? ORDER BY id DESC',
        [`${month}%`]
      );
      return result.map(tx => ({
        ...tx,
        isPaid: Boolean(tx.isPaid),
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  addTransaction: (tx: Omit<Transaction, 'id'>) => {
    try {
      const result = db.runSync(
        'INSERT INTO transactions (title, amount, type, category, notes, isPaid, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tx.title, tx.amount, tx.type, tx.category || null, tx.notes || null, tx.isPaid ? 1 : 0, tx.date]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  },

  updateTransaction: (tx: Transaction) => {
    try {
      db.runSync(
        'UPDATE transactions SET title = ?, amount = ?, type = ?, category = ?, notes = ?, isPaid = ?, date = ? WHERE id = ?',
        [tx.title, tx.amount, tx.type, tx.category || null, tx.notes || null, tx.isPaid ? 1 : 0, tx.date, tx.id]
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  },

  deleteTransaction: (id: number) => {
    try {
      db.runSync('DELETE FROM transactions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },
};
