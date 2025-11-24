import { Tabs } from 'expo-router';
import { Home, Wallet } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#2563eb', // blue-600
        tabBarInactiveTintColor: '#94a3b8', // slate-400
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tasks.title'),
          tabBarIcon: ({ color }) => <Home {...({ size: 24, color } as any)} />,
          tabBarLabel: t('tasks.title'),
        }}
      />
      <Tabs.Screen
        name="money"
        options={{
          title: t('money.title'),
          tabBarIcon: ({ color }) => <Wallet {...({ size: 24, color } as any)} />,
          tabBarLabel: t('money.title'),
        }}
      />
    </Tabs>
  );
}
