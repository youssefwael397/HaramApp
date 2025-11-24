import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (task: { title: string; category?: string }) => void;
}

export const AddTaskModal = ({ visible, onClose, onAdd }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const { t } = useTranslation();

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ title, category });
    setTitle('');
    setCategory('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-800">{t('tasks.newTask')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-600 mb-2">{t('tasks.inputPlaceholder')}</Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-base"
              placeholder={t('tasks.inputPlaceholder')}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-600 mb-2">{t('common.category')}</Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-base"
              placeholder={t('tasks.categoryPlaceholder')}
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <TouchableOpacity
            onPress={handleAdd}
            className="bg-blue-600 p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-lg">{t('tasks.create')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
