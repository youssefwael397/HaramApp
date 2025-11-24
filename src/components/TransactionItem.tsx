import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Transaction } from '../domain/models';
import { Check, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';

interface TransactionItemProps {
  transaction: Transaction;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index?: number;
}

export const TransactionItem = ({ transaction, onToggle, onDelete, index = 0 }: TransactionItemProps) => {
  const isObligation = transaction.type === 'obligation';
  const { t } = useTranslation();
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

  const playToggleSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        // Replace with your actual sound file path
        require('../../assets/sounds/toggle.mp3')
      );
      await sound.playAsync();
      // Unload after playback
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.warn('Toggle sound error', e);
    }
  };

  const handleToggle = async () => {
    await playToggleSound();
    onToggle(transaction.id);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm border border-slate-100"
    >
      {/* Icon */}
      <View className={clsx('w-10 h-10 rounded-full items-center justify-center mr-3', isObligation ? 'bg-red-100' : 'bg-orange-100')}>
        {isObligation ? (
          <ArrowUpRight size={20} color="#dc2626" />
        ) : (
          <ArrowDownLeft size={20} color="#ea580c" />
        )}
      </View>

      {/* Details */}
      <View className="flex-1">
        <Text className="text-base font-medium text-slate-800">{transaction.title}</Text>
        <Text className="text-xs text-slate-500">
          {transaction.category || (isObligation ? t('money.obligation') : t('money.borrowed'))}
        </Text>
      </View>

      {/* Amount & Paid toggle */}
      <View className="items-end mr-3">
        <Text className="text-base font-bold text-slate-900">{transaction.amount.toFixed(2)}</Text>
        <TouchableOpacity onPress={handleToggle}>
          <Text className={clsx('text-xs font-medium', transaction.isPaid ? 'text-green-600' : 'text-slate-400')}>
            {transaction.isPaid ? t('money.paid') : t('money.unpaid')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delete */}
      <TouchableOpacity onPress={() => onDelete(transaction.id)} className="p-2">
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
};
