import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { VisitorLog } from '../screens/VisitorLog';
import { VisitorDetails } from '../screens/VisitorDetails';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
            },
            headerTintColor: '#6B46C1',
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 