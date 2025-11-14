import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export const presetThemes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      primary: '#0a7ea4',
      secondary: '#687076',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#11181C',
      textSecondary: '#687076',
      accent: '#0a7ea4',
      error: '#ff3b30',
      success: '#34c759',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#fff',
      secondary: '#9BA1A6',
      background: '#151718',
      surface: '#1c1c1c',
      text: '#ECEDEE',
      textSecondary: '#9BA1A6',
      accent: '#1DB954',
      error: '#ff453a',
      success: '#30d158',
    },
  },
  spotify: {
    name: 'Spotify',
    colors: {
      primary: '#1DB954',
      secondary: '#1ed760',
      background: '#121212',
      surface: '#181818',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      accent: '#1DB954',
      error: '#e22134',
      success: '#1DB954',
    },
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#007AFF',
      secondary: '#5AC8FA',
      background: '#001F3F',
      surface: '#003366',
      text: '#E6F3FF',
      textSecondary: '#8FC7E8',
      accent: '#00D4FF',
      error: '#FF6B6B',
      success: '#4ECDC4',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#2C1810',
      surface: '#3D2415',
      text: '#FFF5E6',
      textSecondary: '#FFB88C',
      accent: '#FF6B35',
      error: '#FF4757',
      success: '#FFA502',
    },
  },
};

interface ThemeState {
  currentTheme: Theme;
  customThemes: Theme[];
}

const initialState: ThemeState = {
  currentTheme: presetThemes.dark,
  customThemes: [],
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      AsyncStorage.setItem('currentTheme', JSON.stringify(action.payload));
    },
    addCustomTheme: (state, action: PayloadAction<Theme>) => {
      state.customThemes.push(action.payload);
      AsyncStorage.setItem('customThemes', JSON.stringify(state.customThemes));
    },
    removeCustomTheme: (state, action: PayloadAction<string>) => {
      state.customThemes = state.customThemes.filter(
        (theme) => theme.name !== action.payload
      );
      AsyncStorage.setItem('customThemes', JSON.stringify(state.customThemes));
    },
    loadThemes: (state, action: PayloadAction<{ current: Theme; custom: Theme[] }>) => {
      state.currentTheme = action.payload.current;
      state.customThemes = action.payload.custom;
    },
  },
});

export const { setTheme, addCustomTheme, removeCustomTheme, loadThemes } = themeSlice.actions;
export default themeSlice.reducer;

