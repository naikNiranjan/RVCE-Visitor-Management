import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

type RootStackParamList = {
  VisitorRegistration: undefined;
  VisitorAdditionalDetails: {
    formData: {
      name: string;
      address: string;
      contactNumber: string;
      vehicleNumber: string;
      purposeOfVisit: string;
      typeOfVisit: string;
    };
    visitorId: string;
  };
};

type VisitorRegistrationNavigationProp = StackNavigationProp<RootStackParamList>;

export function VisitorRegistration() {
  const navigation = useNavigation<VisitorRegistrationNavigationProp>();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    vehicleNumber: '',
    purposeOfVisit: '',
    typeOfVisit: 'Personal',
  });

  const handleNext = async () => {
    if (!formData.name || !formData.contactNumber || !formData.purposeOfVisit) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create a temporary document in Firestore
      const visitorRef = await addDoc(collection(db, 'visitors'), {
        ...formData,
        status: 'pending',
        registrationDate: new Date().toISOString(),
        checkInTime: null,
        checkOutTime: null,
        additionalDetails: null,
      });

      // Navigate to next screen with the document ID
      navigation.navigate('VisitorAdditionalDetails', { 
        formData,
        visitorId: visitorRef.id 
      });
    } catch (error) {
      console.error('Error saving visitor data:', error);
      alert('Error saving visitor data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitor Registration</Text>
        <Text style={styles.headerSubtitle}>Please fill in the visitor details</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="person" size={20} color="#6B46C1" />
            <Text style={styles.label}>Name of Visitor*</Text>
          </View>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter visitor name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="location-on" size={20} color="#6B46C1" />
            <Text style={styles.label}>Address</Text>
          </View>
          <TextInput
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            placeholder="Enter address"
            style={styles.input}
          />
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
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="directions-car" size={20} color="#6B46C1" />
            <Text style={styles.label}>Vehicle Number (Optional)</Text>
          </View>
          <TextInput
            value={formData.vehicleNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, vehicleNumber: text }))}
            placeholder="Enter vehicle number"
            style={styles.input}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
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