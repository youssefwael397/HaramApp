import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Task } from '../domain/models';
import { Check, Trash2 } from 'lucide-react-native';
import clsx from 'clsx';
import { Audio } from 'expo-av';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index?: number;
}

const playCompleteSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      // Ensure you have this file in assets/sounds
      require('../../assets/sounds/complete.mp3')
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    console.warn('Complete sound error', e);
  }
};

export const TaskItem = ({ task, onToggle, onDelete, index = 0 }: TaskItemProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggle = async () => {
    await playCompleteSound();
    onToggle(task.id);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm border border-slate-100"
    >
      <TouchableOpacity
        onPress={handleToggle}
        className={clsx(
          'w-6 h-6 rounded-full border-2 items-center justify-center mr-3',
          task.isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-300'
        )}
      >
        {task.isCompleted && <Check size={16} color="white" />}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={clsx(
            'text-base font-medium',
            task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
          )}
        >
          {task.title}
        </Text>
        {task.category && (
          <Text className="text-xs text-slate-500">{task.category}</Text>
        )}
      </View>

      <TouchableOpacity onPress={() => onDelete(task.id)} className="p-2">
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
};
