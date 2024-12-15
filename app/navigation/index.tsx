import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
import Settings from '../screens/Settings';
import { ChangePassword } from '../screens/settings/ChangePassword';
import { Privacy } from '../screens/settings/Privacy';
import { About } from '../screens/settings/About';
import { Help } from '../screens/settings/Help';
import { TermsOfService } from '../screens/settings/TermsOfService';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Other screens */}
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="Privacy" component={Privacy} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="TermsOfService" component={TermsOfService} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 