import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('joo_todo_app.db');

export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        dueTime TEXT,
        isCompleted INTEGER DEFAULT 0,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT,
        notes TEXT,
        isPaid INTEGER DEFAULT 0,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        salary REAL DEFAULT 0,
        currency TEXT DEFAULT 'EGP'
      );
      
      INSERT OR IGNORE INTO settings (id, salary, currency) VALUES (1, 0, 'EGP');
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
