import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { VisitorLog } from '../screens/VisitorLog';
import { VisitorDetails } from '../screens/VisitorDetails';
import { RootStackParamList } from '../types/navigation';
import { ThemeProvider } from '../context/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              borderBottomWidth: 0, // Remove the bottom border
            },
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen 
            name="VisitorLog" 
            component={VisitorLog}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="VisitorDetails" 
            component={VisitorDetails}
            options={{
              title: 'Visitor Details',
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: '#6B46C1',
              headerShadowVisible: false,
              ...Platform.select({
                android: {
                  headerBackTitleVisible: false,
                },
              }),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 