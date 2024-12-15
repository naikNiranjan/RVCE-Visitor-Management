import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../../FirebaseConfig';

export default function Settings() {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Navigate to login or auth screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderSettingItem = (
    title: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    onPress?: () => void,
    hasSwitch?: boolean,
    value?: boolean,
    onValueChange?: (value: boolean) => void
  ) => (
    <Pressable 
      style={styles.settingItem}
      onPress={onPress}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color={Colors.PRIMARY} />
      </View>
      <Text style={styles.settingText}>{title}</Text>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: Colors.PRIMARY }}
          thumbColor={'#fff'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#666" />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem(
            'Dark Mode', 
            'moon-outline', 
            undefined,
            true, 
            isDarkMode, 
            toggleTheme
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem(
            'Change Password', 
            'lock-closed-outline',
            () => navigation.navigate('ChangePassword')
          )}
          {renderSettingItem(
            'Privacy', 
            'shield-outline',
            () => navigation.navigate('Privacy')
          )}
        </View>

        {/* More Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          {renderSettingItem(
            'About', 
            'information-circle-outline',
            () => navigation.navigate('About')
          )}
          {renderSettingItem(
            'Help', 
            'help-circle-outline',
            () => navigation.navigate('Help')
          )}
          {renderSettingItem(
            'Terms of Service', 
            'document-text-outline',
            () => navigation.navigate('TermsOfService')
          )}
          {renderSettingItem(
            'Sign Out', 
            'log-out-outline',
            handleSignOut
          )}
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
}); 