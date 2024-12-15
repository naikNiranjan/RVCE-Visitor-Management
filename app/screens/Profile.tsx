// app/screens/Profile.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { auth } from '../../FirebaseConfig';

export default function Profile() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color={Colors.PRIMARY} />
          </View>
          <Text style={styles.userName}>{user?.email}</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <Pressable 
              key={option.id}
              style={styles.optionItem}
              onPress={() => console.log(`${option.title} pressed`)}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={24} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.optionText}>{option.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const profileOptions = [
  { id: 1, title: 'Edit Profile', icon: 'person-outline' },
  { id: 2, title: 'Notifications', icon: 'notifications-outline' },
  { id: 3, title: 'Privacy', icon: 'lock-closed-outline' },
  { id: 4, title: 'Help & Support', icon: 'help-circle-outline' },
] as const;

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
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});
