import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type VisitorDetailsRouteProp = RouteProp<RootStackParamList, 'VisitorDetails'>;

export function VisitorDetails() {
  const route = useRoute<VisitorDetailsRouteProp>();
  const { visitor } = route.params;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with World Map Background */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            {visitor.additionalDetails?.visitorPhotoUrl ? (
              <Image
                source={{ uri: visitor.additionalDetails.visitorPhotoUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#6B46C1" />
              </View>
            )}
            <Text style={styles.name}>{visitor.name}</Text>
            <Text style={styles.email}>{visitor.contactNumber}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { 
                backgroundColor: visitor.status === 'In' ? '#34D399' : '#EF4444' 
              }]} />
              <Text style={styles.statusText}>{visitor.status}</Text>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <DetailItem
            icon="mail-outline"
            label="Contact"
            value={visitor.contactNumber}
          />
          <DetailItem
            icon="location-outline"
            label="Address"
            value={visitor.address}
          />
          <DetailItem
            icon="business-outline"
            label="Department"
            value={visitor.additionalDetails?.department || 'N/A'}
          />
          <DetailItem
            icon="person-outline"
            label="Meeting With"
            value={visitor.additionalDetails?.whomToMeet || 'N/A'}
          />
          <DetailItem
            icon="time-outline"
            label="Check In"
            value={formatDate(visitor.checkInTime)}
          />
          {visitor.checkOutTime && (
            <DetailItem
              icon="time-outline"
              label="Check Out"
              value={formatDate(visitor.checkOutTime)}
            />
          )}
          <DetailItem
            icon="car-outline"
            label="Vehicle Number"
            value={visitor.vehicleNumber || 'N/A'}
          />
          <DetailItem
            icon="document-text-outline"
            label="Purpose"
            value={visitor.purposeOfVisit}
          />
          {visitor.additionalDetails?.visitorCount && (
            <DetailItem
              icon="people-outline"
              label="Visitor Count"
              value={visitor.additionalDetails.visitorCount.toString()}
            />
          )}
          {visitor.additionalDetails?.documentType && (
            <DetailItem
              icon="document-outline"
              label="Document Type"
              value={visitor.additionalDetails.documentType}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <View style={styles.detailItem}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon as any} size={24} color="#6B46C1" />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
}); 