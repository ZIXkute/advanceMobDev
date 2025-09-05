import { View, Text, StyleSheet, Image } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/ken.jpeg')} style={styles.logo} />
      <Text style={styles.title}>My Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1DB954' 
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});
