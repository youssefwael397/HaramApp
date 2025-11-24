import { create } from 'zustand';
import { Task } from '../domain/models';
import { TaskRepository } from '../data/repositories/TaskRepository';
import { format } from 'date-fns';

interface TaskState {
  tasks: Task[];
  completedTasks: Task[];
  currentDate: string;
  isLoading: boolean;
  loadTasks: (date?: string) => void;
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'date'>) => void;
  toggleTask: (id: number, currentStatus: boolean) => void;
  deleteTask: (id: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  completedTasks: [],
  currentDate: format(new Date(), 'yyyy-MM-dd'),
  isLoading: false,

  loadTasks: (date = get().currentDate) => {
    set({ isLoading: true, currentDate: date });
    try {
      const tasks = TaskRepository.getTasksByDate(date);
      // Filter in memory for now, or we could have separate DB queries.
      // The repo getTasksByDate returns ALL tasks for that date.
      // Let's split them here or update repo. 
      // Actually repo getTasksByDate returns all. Let's filter here.
      const active = tasks.filter(t => !t.isCompleted);
      const completed = tasks.filter(t => t.isCompleted);
      set({ tasks: active, completedTasks: completed, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  addTask: (taskData) => {
    const { currentDate } = get();
    const newTask = {
      ...taskData,
      isCompleted: false,
      date: currentDate,
    };
    TaskRepository.addTask(newTask);
    get().loadTasks(currentDate);
  },

  toggleTask: (id, currentStatus) => {
    const { currentDate } = get();
    TaskRepository.toggleTaskCompletion(id, !currentStatus);
    get().loadTasks(currentDate);
  },

  deleteTask: (id) => {
    const { currentDate } = get();
    TaskRepository.deleteTask(id);
    get().loadTasks(currentDate);
  },
}));
