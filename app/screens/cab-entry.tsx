import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

interface CabFormData {
  driverName: string;
  vehicleNumber: string;
  contactNumber: string;
  cabProvider: string;
  purposeOfVisit: string;
}

const CAB_PROVIDERS = [
  { label: 'Ola', value: 'ola' },
  { label: 'Uber', value: 'uber' },
  { label: 'Auto', value: 'auto' },
  { label: 'Private Cab', value: 'private' },
];

export default function CabEntry() {
  const [formData, setFormData] = useState<CabFormData>({
    driverName: '',
    vehicleNumber: '',
    contactNumber: '',
    cabProvider: '',
    purposeOfVisit: '',
  });

  const handleNext = () => {
    if (!formData.driverName || !formData.vehicleNumber || !formData.contactNumber || !formData.cabProvider) {
      alert('Please fill in all required fields');
      return;
    }

    router.push({
      pathname: '/cab-additional-details',
      params: { formData: JSON.stringify(formData) }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="person" size={20} color="#6B46C1" />
            <Text style={styles.label}>Driver Name*</Text>
          </View>
          <TextInput
            value={formData.driverName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, driverName: text }))}
            placeholder="Enter driver name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="directions-car" size={20} color="#6B46C1" />
            <Text style={styles.label}>Vehicle Number*</Text>
          </View>
          <TextInput
            value={formData.vehicleNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, vehicleNumber: text }))}
            placeholder="Enter vehicle number"
            style={styles.input}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="local-taxi" size={20} color="#6B46C1" />
            <Text style={styles.label}>Cab Provider*</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.cabProvider}
              onValueChange={(itemValue) => setFormData(prev => ({ ...prev, cabProvider: itemValue }))}
              style={styles.picker}
            >
              <Picker.Item label="Select cab provider" value="" />
              {CAB_PROVIDERS.map((provider) => (
                <Picker.Item key={provider.value} label={provider.label} value={provider.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="phone" size={20} color="#6B46C1" />
            <Text style={styles.label}>Contact Number*</Text>
          </View>
          <TextInput
            value={formData.contactNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, contactNumber: text }))}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            style={styles.input}
            maxLength={10}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="description" size={20} color="#6B46C1" />
            <Text style={styles.label}>Purpose of Visit*</Text>
          </View>
          <TextInput
            value={formData.purposeOfVisit}
            onChangeText={(text) => setFormData(prev => ({ ...prev, purposeOfVisit: text }))}
            placeholder="Enter purpose of visit"
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>Next</Text>
        <MaterialIcons name="arrow-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  nextButton: {
    backgroundColor: '#6B46C1',
    margin: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6B46C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});