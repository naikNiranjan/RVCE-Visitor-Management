import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      const location = await AsyncStorage.getItem('locationEnabled');
      
      if (notifications !== null) {
        setNotificationsEnabled(JSON.parse(notifications));
      }
      if (location !== null) {
        setLocationEnabled(JSON.parse(location));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateNotifications = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
      setNotificationsEnabled(value);
    } catch (error) {
      console.error('Error saving notification setting:', error);
    }
  };

  const updateLocation = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('locationEnabled', JSON.stringify(value));
      setLocationEnabled(value);
    } catch (error) {
      console.error('Error saving location setting:', error);
    }
  };

  return {
    notificationsEnabled,
    locationEnabled,
    updateNotifications,
    updateLocation,
  };
} 