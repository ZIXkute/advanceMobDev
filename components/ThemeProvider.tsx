import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppSelector } from '@/store/hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemedProvider({ children }: ThemeProviderProps) {
  const { currentTheme } = useAppSelector((state) => state.theme);
  const backgroundColor = useSharedValue(currentTheme.colors.background);

  React.useEffect(() => {
    backgroundColor.value = withTiming(currentTheme.colors.background, {
      duration: 300,
    });
  }, [currentTheme.colors.background]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

