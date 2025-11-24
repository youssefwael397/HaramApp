import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../data/db';
import '../../global.css';
import '../i18n'; // Import i18n config
import { LanguageToggle } from '../components/LanguageToggle';
import { Audio } from 'expo-av'; // Ensure expo-av is available
import { Text } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#f8fafc' },
        headerRight: () => <LanguageToggle />,
        headerLeft: () => <Text style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: '#000',
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 4 },
          textShadowRadius: 10,
          letterSpacing: 0,
        }}>ELHARAM</Text>,
      }}
      initialRouteName="splash"
    >
      {/* Splash screen */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      {/* Main tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
    </Stack>
  );
}
