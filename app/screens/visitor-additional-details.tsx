import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdditionalDetailsFormData, RootStackParamList } from '../types/visitor';
import { Header } from '../components/ui/header';
import { PhotoUploadSection } from '../components/visitor/photo-upload-section';
import { VisitorForm } from '../components/visitor/visitor-form';
import { SubmitButton } from '../components/ui/submit-button';
import { Counter } from '../components/ui/counter';

type ScreenRouteProp = RouteProp<RootStackParamList, 'VisitorAdditionalDetails'>;
type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VisitorAdditionalDetails'>;

export function VisitorAdditionalDetails() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { formData: previousFormData } = route.params;

  const [formData, setFormData] = useState<AdditionalDetailsFormData>({
    whomToMeet: '',
    department: '',
    documentType: '',
    documentUri: '',
    visitorPhotoUri: '',
    sendNotification: true,
    visitorCount: 1,
  });

  const handleSubmit = () => {
    const { whomToMeet, department, documentType } = formData;
    if (!whomToMeet || !department || !documentType) {
      alert('Please fill in all required fields');
      return;
    }

    navigation.navigate('VisitorSuccess', {
      formData: { ...previousFormData, ...formData },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Additional Details" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        <PhotoUploadSection 
          type="visitor" 
          uri={formData.visitorPhotoUri}
          onPhotoSelected={(uri: string) => setFormData(prev => ({
            ...prev, 
            visitorPhotoUri: uri 
          }))}
        />

        <Counter
          label="Number of Visitors"
          count={formData.visitorCount}
          onIncrement={() => setFormData(prev => ({
            ...prev,
            visitorCount: prev.visitorCount + 1
          }))}
          onDecrement={() => setFormData(prev => ({
            ...prev,
            visitorCount: prev.visitorCount - 1
          }))}
          minValue={1}
          maxValue={10}
        />

        <VisitorForm
          formData={formData}
          setFormData={setFormData}
          renderAfter={() => formData.documentType && (
            <PhotoUploadSection 
              type="document" 
              uri={formData.documentUri}
              onPhotoSelected={(uri) => setFormData(prev => ({
                ...prev,
                documentUri: uri 
              }))}
            />
          )}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});
