import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/visitor';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { format } from 'date-fns';
import { Header } from '../components/ui/header';

type VisitorDetailsRouteProp = RouteProp<RootStackParamList, 'VisitorDetails'>;
type VisitorDetailsNavigationProp = StackNavigationProp<RootStackParamList>;

export function VisitorDetails() {
  const route = useRoute<VisitorDetailsRouteProp>();
  const navigation = useNavigation<VisitorDetailsNavigationProp>();
  const { visitorId } = route.params;
  const [visitor, setVisitor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVisitorDetails();
  }, [visitorId]);

  const fetchVisitorDetails = async () => {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const visitorDoc = await getDoc(visitorRef);
      
      if (visitorDoc.exists()) {
        setVisitor({ id: visitorDoc.id, ...visitorDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching visitor details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocument = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const checkOutTime = new Date().toISOString();
      
      await updateDoc(visitorRef, {
        status: 'Out',
        checkOutTime,
        lastUpdated: checkOutTime,
      });

      // Refresh visitor details
      fetchVisitorDetails();
      
    } catch (error) {
      console.error('Error checking out visitor:', error);
      Alert.alert('Error', 'Failed to check out visitor. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  if (!visitor) {
    return (
      <View style={styles.centerContent}>
        <Text>Visitor not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Visitor Details" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
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
          <Text style={styles.visitorName}>{visitor.name}</Text>
          <View style={[
            styles.statusBadge,
            visitor.status === 'In' ? styles.statusIn : 
            visitor.status === 'Out' ? styles.statusOut :
            styles.statusPending
          ]}>
            <Text style={styles.statusText}>{visitor.status}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow icon="call" label="Contact" value={visitor.contactNumber} />
          <DetailRow icon="location" label="Address" value={visitor.address} />
          <DetailRow icon="time" label="Check In" 
            value={visitor.checkInTime ? 
              format(new Date(visitor.checkInTime), 'dd/MM/yyyy hh:mm a') : 
              'Not checked in'
            } 
          />
          {visitor.checkOutTime && (
            <DetailRow icon="time" label="Check Out" 
              value={format(new Date(visitor.checkOutTime), 'dd/MM/yyyy hh:mm a')} 
            />
          )}
          <DetailRow icon="document-text" label="Purpose" value={visitor.purposeOfVisit} />
          
          {visitor.additionalDetails && (
            <>
              <DetailRow 
                icon="person" 
                label="Meeting" 
                value={visitor.additionalDetails.whomToMeet} 
              />
              <DetailRow 
                icon="business" 
                label="Department" 
                value={visitor.additionalDetails.department} 
              />
            </>
          )}
        </View>

        {visitor.additionalDetails?.documentUrl && (
          <TouchableOpacity 
            style={styles.documentButton}
            onPress={() => handleViewDocument(visitor.additionalDetails.documentUrl)}
          >
            <Ionicons name="document-text" size={24} color="#fff" />
            <Text style={styles.documentButtonText}>View ID Document</Text>
          </TouchableOpacity>
        )}

        {visitor.status === 'In' && (
          <TouchableOpacity 
            style={styles.checkOutButton}
            onPress={() => {
              Alert.alert(
                'Confirm Check Out',
                'Are you sure you want to check out this visitor?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Check Out',
                    onPress: handleCheckOut
                  }
                ]
              );
            }}
          >
            <Ionicons name="exit-outline" size={24} color="#fff" />
            <Text style={styles.checkOutButtonText}>Check Out Visitor</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color="#6B46C1" style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitorName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIn: {
    backgroundColor: '#DEF7EC',
  },
  statusOut: {
    backgroundColor: '#FEE2E2',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  documentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  checkOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 