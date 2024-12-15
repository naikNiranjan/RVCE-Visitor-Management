// app/screens/Profile.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { SearchBar } from './components/SearchBar';
import { Ionicons } from '@expo/vector-icons';

interface Visitor {
  id: string;
  name: string;
  contactNumber: string;
  whomToMeet: string;
  department: string;
  purposeOfVisit: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'In' | 'Out';
  visitorPhotoUrl?: string;
  type: string;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export default function TodaysVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodaysVisitors();
  }, []);

  const fetchTodaysVisitors = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const visitorLogsRef = collection(db, 'visitorLogs');
      const q = query(
        visitorLogsRef,
        where('checkInTime', '>=', today.toISOString()),
        where('checkInTime', '<', tomorrow.toISOString()),
        orderBy('checkInTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const visitorData: Visitor[] = [];
      
      querySnapshot.forEach((doc) => {
        visitorData.push({ id: doc.id, ...doc.data() } as Visitor);
      });

      setVisitors(visitorData);
    } catch (error) {
      console.error('Error fetching today\'s visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.contactNumber.includes(searchQuery) ||
    visitor.whomToMeet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVisitorCard = ({ item: visitor }: { item: Visitor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.visitorInfo}>
          {visitor.visitorPhotoUrl ? (
            <Image 
              source={{ uri: visitor.visitorPhotoUrl }} 
              style={styles.visitorPhoto}
            />
          ) : (
            <View style={styles.visitorPhotoPlaceholder}>
              <Ionicons name="person" size={24} color="#6B46C1" />
            </View>
          )}
          <View>
            <Text style={styles.visitorName}>{visitor.name}</Text>
            <Text style={styles.visitorContact}>{visitor.contactNumber}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          visitor.status === 'In' ? styles.statusIn : styles.statusOut
        ]}>
          <Text style={styles.statusText}>{visitor.status}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <DetailRow icon="time" label="Check In" value={formatTime(visitor.checkInTime)} />
        <DetailRow icon="business" label="Department" value={visitor.department} />
        <DetailRow icon="person" label="Meeting" value={visitor.whomToMeet} />
        <DetailRow icon="document-text" label="Purpose" value={visitor.purposeOfVisit} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search visitors..."
            style={styles.searchBar}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6B46C1" />
        </View>
      ) : filteredVisitors.length > 0 ? (
        <FlatList
          data={filteredVisitors}
          renderItem={renderVisitorCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="people" size={48} color="#9CA3AF" />
          <Text style={styles.noVisitorsText}>No visitors today</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color="#6B46C1" style={styles.detailIcon} />
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visitorPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  visitorPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  visitorContact: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FDE8E8',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    width: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  noVisitorsText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
