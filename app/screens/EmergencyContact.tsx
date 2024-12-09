import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';

const emergencyContacts = [
  {
    id: 1,
    name: 'Fire Department',
    icon: 'flame-outline',
    phone: '101',
  },
  {
    id: 2,
    name: 'Police Department',
    icon: 'shield-checkmark-outline',
    phone: '100',
  },
  {
    id: 3,
    name: 'Ambulance',
    icon: 'medkit-outline',
    phone: '102',
  },
];

export default function EmergencyContact() {
  const navigation = useNavigation();

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Failed to initiate call')
    );
  };

  const handleBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} /> 
        </Pressable>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      <View style={styles.contactList}>
        {emergencyContacts.map((contact) => (
          <Pressable
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleCall(contact.phone)}
          >
            <Ionicons
              name={contact.icon as keyof typeof Ionicons.glyphMap}
              size={36}
              color={Colors.PRIMARY}
            />
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
          </Pressable>
        ))}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    flex: 1, // Ensures the title takes the remaining space
  },
  contactList: {
    padding: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 1,
  },
  contactDetails: {
    marginLeft: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  contactPhone: {
    fontSize: 16,
    color: '#555',
  },
});
