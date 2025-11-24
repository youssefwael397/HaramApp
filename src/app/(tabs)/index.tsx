import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskItem } from '../../components/TaskItem';
import { AddTaskModal } from '../../components/AddTaskModal';
import { Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function DailyTasksScreen() {
  const { tasks, completedTasks, loadTasks, addTask, toggleTask, deleteTask, currentDate } = useTaskStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));
  const { t } = useTranslation();

  useEffect(() => {
    loadTasks();
  }, []);

  const today = format(new Date(), 'EEEE, d MMMM');

  const handleFABPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-slate-900">{t('tasks.title')}</Text>
          <Text className="text-slate-500 text-base font-medium">{today}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Active Tasks */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {t('tasks.todo')} ({tasks.length})
            </Text>
            {tasks.length === 0 ? (
              <View className="py-8 items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                <Text className="text-slate-400">{t('tasks.noTasks')}</Text>
              </View>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={(id) => toggleTask(id, task.isCompleted)}
                  onDelete={deleteTask}
                />
              ))
            )}
          </View>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <View>
              <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t('common.completed')} ({completedTasks.length})
              </Text>
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={(id) => toggleTask(id, task.isCompleted)}
                  onDelete={deleteTask}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* FAB with animation */}
        <Animated.View 
          style={{ 
            position: 'absolute', 
            bottom: 24, 
            right: 24,
            transform: [{ scale: fabScale }]
          }}
        >
          <TouchableOpacity
            onPress={handleFABPress}
            className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-blue-300"
          >
            <Plus size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <AddTaskModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addTask}
        />
      </View>
    </SafeAreaView>
  );
}
