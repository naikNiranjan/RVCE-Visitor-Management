import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import Tabs from '../Tabs';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import AboutUs from '../screens/AboutUs';
import SignOut from '../screens/signout';
import EmergencyContact from '../screens/EmergencyContact';
import { Colors } from '@/constants/Colors';

type DrawerParamList = {
  HomeDrawer: undefined;
  Profile: undefined;
  EmergencyContact: undefined;
  AboutUs: undefined;
  Settings: undefined;
  SignOut: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface IconContainerProps {
  children: React.ReactNode;
  isActive: boolean;
}

const IconContainer: React.FC<IconContainerProps> = ({ children, isActive }) => (
  <View style={[styles.iconContainer, { backgroundColor: isActive ? Colors.PRIMARY : '#F3F0FF' }]}>
    {children}
  </View>
);

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.PRIMARY,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerItemStyle: {
          borderRadius: 8,
          paddingVertical: 2,
          marginVertical: 4,
          marginHorizontal: 8,
        },
        drawerLabelStyle: {
          fontSize: 15,
          marginLeft: -10,
        },
      }}>
      <Drawer.Screen
        name="HomeDrawer"
        component={Tabs}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <IconContainer isActive={color === '#fff'}>
              <Ionicons name="home-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </IconContainer>
          ),
          accessibilityLabel: 'Navigate to Home',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color }) => (
            <IconContainer isActive={color === '#fff'}>
              <Ionicons name="person-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </IconContainer>
          ),
          accessibilityLabel: 'Navigate to Profile',
        }}
      />
      <Drawer.Screen
        name="EmergencyContact"
        component={EmergencyContact}
        options={{
          drawerLabel: 'Emergency Contact',
          drawerIcon: ({ color }) => (
            <IconContainer isActive={color === '#fff'}>
              <Ionicons name="call-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </IconContainer>
          ),
          accessibilityLabel: 'Navigate to Emergency Contact',
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          drawerLabel: 'About Us',
          drawerIcon: ({ color }) => (
            <IconContainer isActive={color === '#fff'}>
              <Ionicons name="information-circle-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </IconContainer>
          ),
          accessibilityLabel: 'Navigate to About Us',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <IconContainer isActive={color === '#fff'}>
              <Ionicons name="settings-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </IconContainer>
          ),
          accessibilityLabel: 'Navigate to Settings',
        }}
      />
      <Drawer.Screen
        name="SignOut"
        component={SignOut}
        options={{
          drawerLabel: 'Sign Out',
          drawerIcon: ({ color }) => (
            <IconContainer isActive={color === '#fff'}>
              <Ionicons name="log-out-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </IconContainer>
          ),
          accessibilityLabel: 'Sign out of the app',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});
