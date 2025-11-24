import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const router = useRouter();

  useEffect(() => {
    // Animate splash screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main app after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Hazy overlay */}
      <View style={styles.hazyOverlay} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>ELHARAM</Text>
        <Text style={styles.subtitle}>Daily Manager</Text>
      </Animated.View>

      {/* Floating circles for hazy effect */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hazyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // Note: backdropFilter is not supported in React Native; using opacity for hazy effect
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    fontSize: 70,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 10,
    opacity: 0.9,
    letterSpacing: 2,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    right: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -75,
  },
});
