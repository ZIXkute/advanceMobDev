import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTheme, addCustomTheme, removeCustomTheme, presetThemes, Theme } from '@/store/themeSlice';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentTheme, customThemes } = useAppSelector((state) => state.theme);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customThemeName, setCustomThemeName] = useState('');
  const [customColors, setCustomColors] = useState<Partial<Theme['colors']>>({
    primary: '#1DB954',
    accent: '#1DB954',
    background: '#121212',
    surface: '#181818',
    text: '#ffffff',
  });

  const scale = useSharedValue(1);

  const handleThemeSelect = (theme: Theme) => {
    scale.value = 0.95;
    scale.value = withSpring(1);
    dispatch(setTheme(theme));
  };

  const handleSaveCustomTheme = () => {
    if (!customThemeName.trim()) {
      Alert.alert('Error', 'Please enter a theme name');
      return;
    }

    const newTheme: Theme = {
      name: customThemeName,
      colors: {
        ...presetThemes.dark.colors,
        ...customColors,
      } as Theme['colors'],
    };

    dispatch(addCustomTheme(newTheme));
    dispatch(setTheme(newTheme));
    setCustomThemeName('');
    setCustomColors({
      primary: '#1DB954',
      accent: '#1DB954',
      background: '#121212',
      surface: '#181818',
      text: '#ffffff',
    });
    Alert.alert('Success', 'Custom theme saved!');
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderThemeCard = (theme: Theme, isCustom = false) => {
    const isSelected = currentTheme.name === theme.name;
    const cardScale = useSharedValue(isSelected ? 1.05 : 1);

    React.useEffect(() => {
      cardScale.value = withSpring(isSelected ? 1.05 : 1);
    }, [isSelected]);

    const cardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: cardScale.value }],
    }));

    return (
      <AnimatedTouchable
        key={theme.name}
        style={[styles.themeCard, cardStyle, { backgroundColor: theme.colors.surface }]}
        onPress={() => handleThemeSelect(theme)}
        activeOpacity={0.8}
      >
        <View style={[styles.colorPreview, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.colorPreview, { backgroundColor: theme.colors.accent }]} />
        <View style={[styles.colorPreview, { backgroundColor: theme.colors.background }]} />
        <Text style={[styles.themeName, { color: theme.colors.text }]}>{theme.name}</Text>
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.accent }]} />
        )}
        {isCustom && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Theme',
                `Are you sure you want to delete "${theme.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => dispatch(removeCustomTheme(theme.name)),
                  },
                ]
              );
            }}
          >
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        )}
      </AnimatedTouchable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: currentTheme.colors.accent }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>Theme Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Preset Themes
          </Text>
          <View style={styles.themeGrid}>
            {Object.values(presetThemes).map((theme) => renderThemeCard(theme))}
          </View>
        </View>

        {customThemes.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
              Custom Themes
            </Text>
            <View style={styles.themeGrid}>
              {customThemes.map((theme) => renderThemeCard(theme, true))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            Create Custom Theme
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.primary,
              },
            ]}
            placeholder="Theme Name"
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={customThemeName}
            onChangeText={setCustomThemeName}
          />

          <View style={styles.colorInputs}>
            {Object.entries(customColors).map(([key, value]) => (
              <View key={key} style={styles.colorInputRow}>
                <Text style={[styles.colorLabel, { color: currentTheme.colors.text }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <View style={styles.colorInputContainer}>
                  <View style={[styles.colorPreviewSmall, { backgroundColor: value }]} />
                  <TextInput
                    style={[
                      styles.colorInput,
                      {
                        backgroundColor: currentTheme.colors.surface,
                        color: currentTheme.colors.text,
                      },
                    ]}
                    value={value}
                    onChangeText={(text) =>
                      setCustomColors({ ...customColors, [key]: text })
                    }
                    placeholder="#000000"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                  />
                </View>
              </View>
            ))}
          </View>

          <AnimatedTouchable
            style={[
              styles.saveButton,
              animatedButtonStyle,
              { backgroundColor: currentTheme.colors.accent },
            ]}
            onPress={handleSaveCustomTheme}
          >
            <Text style={styles.saveButtonText}>Save Custom Theme</Text>
          </AnimatedTouchable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  themeCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 5,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  colorInputs: {
    marginBottom: 20,
  },
  colorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
  },
  colorInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorPreviewSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

