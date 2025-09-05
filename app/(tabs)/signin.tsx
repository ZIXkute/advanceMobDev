import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SpotifyLogin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/spot.png')} style={styles.logo} />
      <Text style={styles.title}>Spotify</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.forgot}>Forgot password?</Text>

      {/* Navigate to Home */}
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(home)')}>
        <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>

      <Text style={styles.socialText}>Be Correct With</Text>
      <View style={styles.socialIcons}>
        <Image source={require('@/assets/images/pisbok.png')} style={styles.socialIcon} />
        <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
      </View>

      {/* Navigate to Sign Up */}
      <Text style={styles.signup}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/signup')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: '#aaa',
    fontSize: 12,
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    backgroundColor: '#1DB954',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 25,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialText: {
    color: '#1DB954',
    fontSize: 14,
    marginBottom: 25,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 25,
  },
  socialIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  signup: {
    color: '#aaa',
    fontSize: 14,
  },
  signupLink: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});
