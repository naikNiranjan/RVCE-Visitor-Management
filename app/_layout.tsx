import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './navigation/DrawerNavigator';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding before font load

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Get current theme mode (light or dark)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Load custom font
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide splash screen after fonts are loaded
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Don't render anything if fonts are not loaded
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <DrawerNavigator /> {/* Drawer navigation */}
        <StatusBar style="auto" /> {/* Status bar configuration */}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
