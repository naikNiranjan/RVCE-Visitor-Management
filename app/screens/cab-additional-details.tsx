import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { PhotoUploadSection } from '../components/visitor/photo-upload-section';
import { SubmitButton } from '../components/ui/submit-button';

interface AdditionalDetailsFormData {
  driverPhotoUri: string;
  vehiclePhotoUri: string;
  licensePhotoUri: string;
}

const CabAdditionalDetails = () => {
  const params = useLocalSearchParams();
  const previousFormData = JSON.parse(params.formData as string);

  const [formData, setFormData] = useState<AdditionalDetailsFormData>({
    driverPhotoUri: '',
    vehiclePhotoUri: '',
    licensePhotoUri: '',
  });

  const handleSubmit = () => {
    if (!formData.driverPhotoUri || !formData.vehiclePhotoUri || !formData.licensePhotoUri) {
      alert('Please upload all required photos');
      return;
    }

    // TODO: Implement submission logic
    console.log('Submitting:', { ...previousFormData, ...formData });
    router.push('/cab-entry-success');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#6B46C1" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Additional Details</Text>
          <Text style={styles.headerSubtitle}>Please provide required photos</Text>
        </View>
      </View>

      <View style={styles.content}>
        <PhotoUploadSection 
          type="driver"
          label="Driver Photo"
          uri={formData.driverPhotoUri}
          onPhotoSelected={(uri) => setFormData(prev => ({ 
            ...prev, 
            driverPhotoUri: uri 
          }))}
        />

        <PhotoUploadSection 
          type="vehicle"
          label="Vehicle Photo"
          uri={formData.vehiclePhotoUri}
          onPhotoSelected={(uri) => setFormData(prev => ({ 
            ...prev, 
            vehiclePhotoUri: uri 
          }))}
        />

        <PhotoUploadSection 
          type="license"
          label="Driver's License"
          uri={formData.licensePhotoUri}
          onPhotoSelected={(uri) => setFormData(prev => ({ 
            ...prev, 
            licensePhotoUri: uri 
          }))}
        />
      </View>

      <View style={styles.footer}>
        <SubmitButton 
          onPress={handleSubmit}
          label="Submit"
        />
      </View>
    </SafeAreaView>
  );
};

export default CabAdditionalDetails;

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
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
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
}); 