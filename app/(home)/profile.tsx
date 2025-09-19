import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savedName, setSavedName] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [savedGenre, setSavedGenre] = useState("Pop");
  const [errorImage, setErrorImage] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current; // ✅ keeps value between renders

  // Load saved profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem("profile_name");
        const storedEmail = await AsyncStorage.getItem("profile_email");
        const storedGenre = await AsyncStorage.getItem("profile_genre");
        if (storedName) setSavedName(storedName);
        if (storedEmail) setSavedEmail(storedEmail);
        if (storedGenre) setSavedGenre(storedGenre);
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  const validateName = (text: string) => {
    setName(text);
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(text)) {
      setNameError(
        "Name must be 3–20 characters, alphanumeric and underscores only."
      );
    } else {
      setNameError("");
    }
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError("Email must be a valid format (example@mail.com).");
    } else {
      setEmailError("");
    }
  };

  const validateAndSave = async () => {
    if (nameError || emailError || !name || !email) {
      triggerShake();
      Vibration.vibrate(200); // ✅ vibrate
      setErrorImage(true);
      setTimeout(() => setErrorImage(false), 2000);
      return;
    }

    setSavedName(name);
    setSavedEmail(email);
    setSavedGenre(genre);

    try {
      await AsyncStorage.setItem("profile_name", name);
      await AsyncStorage.setItem("profile_email", email);
      await AsyncStorage.setItem("profile_genre", genre);
    } catch (error) {
      console.log("Error saving profile:", error);
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          errorImage
            ? require("@/assets/images/error.jpeg")
            : require("@/assets/images/clarke.webp")
        }
        style={styles.logo}
      />
      <Text style={styles.title}>My Profile</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={name}
          onChangeText={validateName}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={genre}
            onValueChange={(itemValue) => setGenre(itemValue)}
            dropdownIconColor="#1DB954"
            style={styles.picker}
          >
            <Picker.Item label="Pop" value="Pop" />
            <Picker.Item label="Rock" value="Rock" />
            <Picker.Item label="Jazz" value="Jazz" />
            <Picker.Item label="Classical" value="Classical" />
            <Picker.Item label="Hip-Hop" value="Hip-Hop" />
          </Picker>
        </View>
      </Animated.View>

      <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      {savedName !== "" && savedEmail !== "" && (
        <View style={styles.savedContainer}>
          <Text style={styles.savedText}>👤 {savedName}</Text>
          <Text style={styles.savedText}>📧 {savedEmail}</Text>
          <Text style={styles.savedText}>🎵 Favorite Genre: {savedGenre}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1DB954", marginBottom: 20 },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
    borderRadius: 100,
  },
  input: {
    width: 280,
    backgroundColor: "#222",
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 6,
  },
  pickerContainer: {
    width: 280,
    backgroundColor: "#222",
    borderRadius: 25,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1DB954",
  },
  picker: { color: "white", height: 50, width: "100%" },
  saveButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  error: { color: "red", marginBottom: 8, textAlign: "left", width: 280 },
  savedContainer: { marginTop: 30, alignItems: "center" },
  savedText: { color: "white", fontSize: 16, marginVertical: 4 },
});
