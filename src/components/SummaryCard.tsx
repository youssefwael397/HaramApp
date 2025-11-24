import { View, Text } from 'react-native';
import clsx from 'clsx';

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: 'neutral' | 'positive' | 'negative' | 'warning';
}

export const SummaryCard = ({ title, amount, type = 'neutral' }: SummaryCardProps) => {
  const getColors = () => {
    switch (type) {
      case 'positive': return "bg-green-50 border-green-200 text-green-700";
      case 'negative': return "bg-red-50 border-red-200 text-red-700";
      case 'warning': return "bg-orange-50 border-orange-200 text-orange-700";
      default: return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  return (
    <View className={clsx("flex-1 p-3 rounded-xl border mb-3 mx-1", getColors().split(' ').slice(0, 2).join(' '))}>
      <Text className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{title}</Text>
      <Text className={clsx("text-lg font-bold", getColors().split(' ').pop())}>
        {amount.toFixed(2)}
      </Text>
    </View>
  );
};
