import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Animated } from 'react-native';
import { useTransactionStore } from '../../store/useTransactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { SummaryCard } from '../../components/SummaryCard';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { Plus, Edit2, Download } from 'lucide-react-native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { exportTransactionsToExcel } from '../../utils/csvExporter';
import { MobileStatusBar } from '../../components/MobileStatusBar';

export default function MoneyManagerScreen() {
  const {
    transactions,
    salary,
    loadData,
    addTransaction,
    updateSalary,
    togglePaid,
    deleteTransaction,
    totalObligations,
    totalBorrowed,
    remainingSalary,
    currentMonth,
  } = useTransactionStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [tempSalary, setTempSalary] = useState('');
  const [downloadScale] = useState(new Animated.Value(1));
  const [fabScale] = useState(new Animated.Value(1));
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSalary = () => {
    const amount = parseFloat(tempSalary);
    if (!isNaN(amount)) {
      updateSalary(amount);
    }
    setIsEditingSalary(false);
  };

  const handleExport = async () => {
    try {
      Animated.sequence([
        Animated.timing(downloadScale, { toValue: 0.85, duration: 100, useNativeDriver: true }),
        Animated.timing(downloadScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      await exportTransactionsToExcel(
        transactions,
        currentMonth,
        salary,
        totalObligations,
        totalBorrowed,
        remainingSalary
      );
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleFABPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Custom status bar */}
      {/* <MobileStatusBar /> */}
      <View className="flex-1 px-5 pt-6">
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-start">
          <View>
            <Text className="text-3xl font-bold text-slate-900">{t('money.title')}</Text>
            <Text className="text-slate-500 text-base font-medium">{format(new Date(), 'MMMM yyyy')}</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: downloadScale }] }}>
            <TouchableOpacity onPress={handleExport} className="p-2 bg-slate-100 rounded-full">
              <Download {...({ size: 24, color: '#475569' } as any)} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Salary Section */}
          <View className="bg-blue-600 p-5 rounded-2xl mb-6 shadow-lg shadow-blue-200">
            <Text className="text-blue-100 text-sm font-medium mb-1">{t('money.salary')}</Text>
            {isEditingSalary ? (
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-500 text-white text-3xl font-bold p-0 rounded"
                  value={tempSalary}
                  onChangeText={setTempSalary}
                  keyboardType="numeric"
                  autoFocus
                  onBlur={handleUpdateSalary}
                  onSubmitEditing={handleUpdateSalary}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setTempSalary(salary.toString());
                  setIsEditingSalary(true);
                }}
                className="flex-row items-center justify-between"
              >
                <Text className="text-white text-3xl font-bold">
                  {salary.toLocaleString()} <Text className="text-xl">EGP</Text>
                </Text>
                <Edit2 {...({ size: 20, color: '#93c5fd' } as any)} />
              </TouchableOpacity>
            )}
          </View>

          {/* Summary Cards */}
          <View className="flex-row mb-6">
            <SummaryCard title={t('money.obligations')} amount={totalObligations} type="negative" />
            <SummaryCard title={t('money.borrowed')} amount={totalBorrowed} type="warning" />
          </View>
          <View className="flex-row mb-6">
            <SummaryCard
              title={t('money.remaining')}
              amount={remainingSalary}
              type={remainingSalary >= 0 ? 'positive' : 'negative'}
            />
          </View>

          {/* Transactions List */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {t('money.transactions')} ({transactions.length})
            </Text>
            {transactions.length === 0 ? (
              <View className="py-8 items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                <Text className="text-slate-400">{t('money.noTransactions')}</Text>
              </View>
            ) : (
              transactions.map((tx, index) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  index={index}
                  onToggle={(id) => togglePaid(id, tx.isPaid)}
                  onDelete={deleteTransaction}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB with animation */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            transform: [{ scale: fabScale }],
          }}
        >
          <TouchableOpacity
            onPress={handleFABPress}
            className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-blue-300"
          >
            <Plus {...({ size: 28, color: 'white' } as any)} />
          </TouchableOpacity>
        </Animated.View>

        <AddTransactionModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addTransaction}
        />
      </View>
    </SafeAreaView>
  );
}
