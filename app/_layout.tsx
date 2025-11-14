import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '@/store/store';
import { loadThemes, presetThemes } from '@/store/themeSlice';

function AppContent() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Load saved themes on app start
    const loadSavedThemes = async () => {
      try {
        const [currentThemeJson, customThemesJson] = await Promise.all([
          AsyncStorage.getItem('currentTheme'),
          AsyncStorage.getItem('customThemes'),
        ]);

        const current = currentThemeJson
          ? JSON.parse(currentThemeJson)
          : presetThemes.dark;
        const custom = customThemesJson ? JSON.parse(customThemesJson) : [];

        store.dispatch(loadThemes({ current, custom }));
      } catch (error) {
        console.error('Error loading themes:', error);
        store.dispatch(loadThemes({ current: presetThemes.dark, custom: [] }));
      }
    };

    loadSavedThemes();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="map" options={{ headerShown: false }} />
        <Stack.Screen name="theme-settings" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
