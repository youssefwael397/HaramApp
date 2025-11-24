import { db } from '../db';
import { Task } from '../../domain/models';

export const TaskRepository = {
  getTasksByDate: (date: string): Task[] => {
    try {
      const result = db.getAllSync<Task>(
        'SELECT * FROM tasks WHERE date = ? ORDER BY id DESC',
        [date]
      );
      return result.map(task => ({
        ...task,
        isCompleted: Boolean(task.isCompleted),
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getCompletedTasks: (date: string): Task[] => {
     try {
      const result = db.getAllSync<Task>(
        'SELECT * FROM tasks WHERE date = ? AND isCompleted = 1 ORDER BY id DESC',
        [date]
      );
      return result.map(task => ({
        ...task,
        isCompleted: Boolean(task.isCompleted),
      }));
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      return [];
    }
  },

  addTask: (task: Omit<Task, 'id'>) => {
    try {
      const result = db.runSync(
        'INSERT INTO tasks (title, description, category, dueTime, isCompleted, date) VALUES (?, ?, ?, ?, ?, ?)',
        [task.title, task.description || null, task.category || null, task.dueTime || null, task.isCompleted ? 1 : 0, task.date]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  },

  updateTask: (task: Task) => {
    try {
      db.runSync(
        'UPDATE tasks SET title = ?, description = ?, category = ?, dueTime = ?, isCompleted = ? WHERE id = ?',
        [task.title, task.description || null, task.category || null, task.dueTime || null, task.isCompleted ? 1 : 0, task.id]
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  deleteTask: (id: number) => {
    try {
      db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },
  
  toggleTaskCompletion: (id: number, isCompleted: boolean) => {
      try {
          db.runSync('UPDATE tasks SET isCompleted = ? WHERE id = ?', [isCompleted ? 1 : 0, id]);
      } catch (error) {
          console.error('Error toggling task completion:', error);
      }
  }
};
