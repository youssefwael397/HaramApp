import { db } from '../db';
import { Settings } from '../../domain/models';

export const SettingsRepository = {
  getSettings: (): Settings | null => {
    try {
      const result = db.getFirstSync<Settings>('SELECT * FROM settings WHERE id = 1');
      return result || null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  updateSalary: (salary: number) => {
    try {
      db.runSync('UPDATE settings SET salary = ? WHERE id = 1', [salary]);
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  },
};
