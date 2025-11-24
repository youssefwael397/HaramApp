import { View, Text, StyleSheet } from 'react-native';
import { Wifi, Signal, Battery } from 'lucide-react-native';
import { format } from 'date-fns';

export const MobileStatusBar = () => {
  const now = new Date();
  const time = format(now, 'HH:mm');

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Signal size={16} color="#000" />
        <Wifi size={16} color="#000" style={styles.iconSpacing} />
      </View>
      <Text style={styles.time}>{time}</Text>
      <Battery size={16} color="#000" style={styles.iconSpacing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#fff', // dark bar similar to iOS
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 6,
  },
  time: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
});
