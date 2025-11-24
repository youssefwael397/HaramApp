import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import clsx from 'clsx';
import { TransactionType } from '../domain/models';
import { useTranslation } from 'react-i18next';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (tx: { title: string; amount: number; type: TransactionType; category?: string }) => void;
}

export const AddTransactionModal = ({ visible, onClose, onAdd }: AddTransactionModalProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('obligation');
  const [category, setCategory] = useState('');
  const { t } = useTranslation();

  const handleAdd = () => {
    if (!title.trim() || !amount) return;
    onAdd({ 
      title, 
      amount: parseFloat(amount), 
      type, 
      category 
    });
    setTitle('');
    setAmount('');
    setType('obligation');
    setCategory('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-white rounded-t-3xl p-6 h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-800">{t('money.addTransaction')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X {...({ size: 24, color: "#64748b" } as any)} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Type Selection */}
            <View className="flex-row mb-6 bg-slate-100 p-1 rounded-xl">
              <TouchableOpacity 
                onPress={() => setType('obligation')}
                className={clsx(
                  "flex-1 py-3 rounded-lg items-center",
                  type === 'obligation' ? "bg-white shadow-sm" : ""
                )}
              >
                <Text className={clsx("font-bold", type === 'obligation' ? "text-slate-900" : "text-slate-500")}>
                  {t('money.obligation')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setType('borrowed')}
                className={clsx(
                  "flex-1 py-3 rounded-lg items-center",
                  type === 'borrowed' ? "bg-white shadow-sm" : ""
                )}
              >
                <Text className={clsx("font-bold", type === 'borrowed' ? "text-slate-900" : "text-slate-500")}>
                  {t('money.borrowed')}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-slate-600 mb-2">{t('money.transactionTitle')}</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-base"
                placeholder={t('money.titlePlaceholder')}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-slate-600 mb-2">{t('money.amount')}</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-base"
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View className="mb-8">
              <Text className="text-sm font-medium text-slate-600 mb-2">{t('money.category')}</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-base"
                placeholder={t('money.categoryPlaceholder')}
                value={category}
                onChangeText={setCategory}
              />
            </View>

            <TouchableOpacity
              onPress={handleAdd}
              className="bg-blue-600 p-4 rounded-xl items-center mb-6"
            >
              <Text className="text-white font-bold text-lg">{t('money.addTransaction')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
