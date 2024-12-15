import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/visitor';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

interface Props {
  route: RouteProp<RootStackParamList, 'VisitorSuccess'>;
}

export function VisitorSuccess({ route }: Props) {
  const { formData, visitorId } = route.params;
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const visitorRef = doc(db, 'visitors', visitorId);
        const visitorDoc = await getDoc(visitorRef);
        if (visitorDoc.exists()) {
          const data = visitorDoc.data();
          if (data.checkInTime) {
            setCheckInTime(data.checkInTime);
          }
        }
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitorData();
  }, [visitorId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Check-In Successful!</Text>
        
        <View style={styles.detailsContainer}>
          <DetailRow label="Name" value={formData.name} />
          <DetailRow label="Contact" value={formData.contactNumber} />
          <DetailRow label="Purpose" value={formData.purposeOfVisit} />
          <DetailRow label="Department" value={formData.department} />
          <DetailRow label="Meeting With" value={formData.whomToMeet} />
          <DetailRow label="Number of Visitors" value={formData.visitorCount.toString()} />
          {checkInTime && (
            <DetailRow 
              label="Check-In Time" 
              value={formatDate(checkInTime)}
            />
          )}
        </View>

        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>Visitor ID:</Text>
          <Text style={styles.idValue}>{visitorId}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 32,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  idLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  idValue: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '600',
  },
}); 