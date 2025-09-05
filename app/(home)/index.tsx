// app/(home)/index.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Spotify 🎶</Text>
      <Text style={styles.subtitle}>This is your Home page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1DB954', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'white' },
});
