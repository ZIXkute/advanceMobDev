import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const router = useRouter();
  const [gender, setGender] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Logo + Title Row */}
      <View style={styles.logoRow}>
        <Image source={require('../assets/images/spot.png')} style={styles.logo} />
        <Text style={styles.title}>Spotify</Text>
      </View>

      <TextInput placeholder="Email Address" placeholderTextColor="#aaa" style={styles.input} />
      <TextInput placeholder="Full Name" placeholderTextColor="#aaa" style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor="#aaa" secureTextEntry style={styles.input} />

      <Text style={styles.dob}>Date Of Birth :</Text>
      <View style={styles.dobRow}>
        <TextInput placeholder="DD" placeholderTextColor="#aaa" style={styles.dobInput} maxLength={2} keyboardType="numeric" />
        <TextInput placeholder="MM" placeholderTextColor="#aaa" style={styles.dobInput} maxLength={2} keyboardType="numeric" />
        <TextInput placeholder="YY" placeholderTextColor="#aaa" style={styles.dobInput} maxLength={2} keyboardType="numeric" />
      </View>

      {/* Gender Selection */}
      <View style={styles.genderRow}>
        <TouchableOpacity style={styles.genderOption} onPress={() => setGender('Male')}>
          <View style={styles.circle}>
            {gender === 'Male' && <View style={styles.checkedCircle} />}
          </View>
          <Text style={styles.gender}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.genderOption} onPress={() => setGender('Female')}>
          <View style={styles.circle}>
            {gender === 'Female' && <View style={styles.checkedCircle} />}
          </View>
          <Text style={styles.gender}>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Go back to Sign In */}
      <Text style={styles.signup}>
        Already have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/signin')}>
          Sign In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  
  logoRow: {
  flexDirection: 'row', 
  alignItems: 'center', 
  marginBottom: 100 
},

  logo: { 
    width: 35, 
    height: 35, 
    resizeMode: 'contain', 
    marginRight: 10 
},
  title: { 
    fontSize: 28, 
    color: 'white', 
    fontWeight: 'bold' 
},

  input: { 
    width: '100%', 
    backgroundColor: '#222', 
    color: 'white', 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginBottom: 15 
},

  dob: { 
    color: '#1DB954', 
    alignSelf: 'flex-start', 
    marginBottom: 5 
},

  dobRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 15 
},

  dobInput: { 
    flex: 1, 
    backgroundColor: '#222', 
    color: 'white', 
    textAlign: 'center', 
    marginHorizontal: 5, 
    paddingVertical: 12, 
    borderRadius: 20 
},

  genderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '60%', 
    marginBottom: 20 
},

  genderOption: { 
    flexDirection: 'row', 
    alignItems: 'center'
 },

  gender: {
     color: 'white', 
     marginLeft: 8 
    },
    
  circle: { 
    height: 20, 
    width: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#000000', 
    alignItems: 'center', 
    justifyContent: 'center' 
},

  checkedCircle: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#1DB954' 
},

  btn: { 
    width: '100%', 
    backgroundColor: '#1DB954', 
    paddingVertical: 14, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginBottom: 25 
},

  btnText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
},

  signup: { 
    color: '#aaa', 
    fontSize: 14 
},

  signupLink: { 
    color: '#1DB954', 
    fontWeight: 'bold' 
},

});
