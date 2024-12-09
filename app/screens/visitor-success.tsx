import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../types/visitor';
import { useRoute, RouteProp } from '@react-navigation/native';

type ScreenRouteProp = RouteProp<RootStackParamList, 'VisitorSuccess'>;

export function VisitorSuccess() {
  const route = useRoute<ScreenRouteProp>();
  const { formData } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.successMessage}>
        <Text style={styles.header}>Thank you for registering!</Text>
        <Text style={styles.body}>Visitor details have been successfully recorded. Please proceed with your visit.</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Visitor Details:</Text>
        <Text style={styles.details}>Name: {formData.name}</Text>
        <Text style={styles.details}>Contact: {formData.contactNumber}</Text>
        <Text style={styles.details}>Purpose: {formData.purposeOfVisit}</Text>
        <Text style={styles.details}>Whom to Meet: {formData.whomToMeet}</Text>
        <Text style={styles.details}>Department: {formData.department}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  successMessage: {
    marginBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  body: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    marginBottom: 6,
  },
});
