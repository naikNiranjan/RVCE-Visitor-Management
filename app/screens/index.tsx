import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Home';
import QuickCheckInScreen from './quick-check-in';
import CabEntry from './cab-entry';
import ApprovalStatus from './ApprovaStatus';
import TodaysVisitors from './TodaysVisitors';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VisitorEntry from './VisitorEntry';
import Document from './document';
import VisitorLog from './VisitorLog';
import {VisitorDetails} from './VisitorDetails';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
        headerTintColor: Colors.PRIMARY,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="QuickCheckIn" 
        component={QuickCheckInScreen} 
        options={({ navigation }) => ({ 
          title: 'Quick Check-In',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="CabEntry" 
        component={CabEntry} 
        options={({ navigation }) => ({ 
          title: 'Cab Entry',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ApprovalStatus" 
        component={ApprovalStatus} 
        options={{ title: 'Approval Status' }}
      />
      <Stack.Screen 
        name="TodaysVisitors" 
        component={TodaysVisitors} 
        options={{ title: 'TodaysVisitors' }}
      />
      <Stack.Screen 
        name="VisitorEntry" 
        component={VisitorEntry} 
        options={{ title: 'VisitorEntry' }}
      />
      <Stack.Screen 
        name="Document" 
        component={Document} 
        options={{ title: 'Documents' }}
      />
      <Stack.Screen 
        name="VisitorLog" 
        component={VisitorLog}
        options={{ title: 'Visitor Log' }}
      />
      <Stack.Screen 
        name="VisitorDetails" 
        component={VisitorDetails} 
        options={{ title: 'Visitor Details' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
