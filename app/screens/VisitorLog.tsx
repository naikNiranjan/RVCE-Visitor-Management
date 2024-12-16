import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterSidebar } from './components/FilterSideBar';
import { collection, query, getDocs, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/visitor';

type VisitorLogNavigationProp = StackNavigationProp<RootStackParamList>;

interface VisitorLogData {
  id: string;
  name: string;
  checkInTime: string;
  checkOutTime: string | null;
  purpose: string;
  whomToMeet: string;
  department: string;
  status: 'In' | 'Out' | 'pending';
  contactNumber: string;
  visitorPhotoUrl?: string;
  documentUrl?: string;
  type: string;
  lastUpdated?: string;
}

export const VisitorLog = () => {
  const navigation = useNavigation<VisitorLogNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visitors, setVisitors] = useState<VisitorLogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [] as string[],
    department: [] as string[],
    sortBy: null,
    sortOrder: 'asc' as const,
  });

  useEffect(() => {
    setIsLoading(true);
    
    // Set up real-time listener
    const visitorRef = collection(db, 'visitors');
    const q = query(
      visitorRef,
      orderBy('registrationDate', 'desc') // Order by registration date
    );

    const unsubscribe = onSnapshot(
      q,
      {
        next: (querySnapshot) => {
          const visitorData: VisitorLogData[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            visitorData.push({
              id: doc.id,
              name: data.name || '',
              checkInTime: data.checkInTime || '',
              checkOutTime: data.checkOutTime || null,
              purpose: data.purposeOfVisit || '',
              whomToMeet: data.additionalDetails?.whomToMeet || '',
              department: data.additionalDetails?.department || '',
              status: data.status || 'pending',
              contactNumber: data.contactNumber || '',
              visitorPhotoUrl: data.additionalDetails?.visitorPhotoUrl || '',
              documentUrl: data.additionalDetails?.documentUrl || '',
              type: data.type || 'visitor',
              lastUpdated: data.lastUpdated || data.checkInTime || data.registrationDate || '',
            });
          });

          // Sort visitors by status and time
          const sortedVisitors = visitorData.sort((a, b) => {
            // Show 'In' status first, then 'pending', then 'Out'
            const statusOrder = { 'In': 0, 'pending': 1, 'Out': 2 };
            const statusDiff = statusOrder[a.status] - statusOrder[b.status];
            
            if (statusDiff !== 0) return statusDiff;
            
            // Then sort by check-in time (most recent first)
            const timeA = new Date(a.lastUpdated || a.checkInTime || '').getTime();
            const timeB = new Date(b.lastUpdated || b.checkInTime || '').getTime();
            return timeB - timeA;
          });

          setVisitors(sortedVisitors);
          setIsLoading(false);
        },
        error: (error) => {
          console.error('Error fetching visitors:', error);
          setIsLoading(false);
          Alert.alert(
            'Error',
            'Failed to fetch visitor data. Please try again later.'
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleVisitorPress = (visitor: VisitorLogData) => {
    navigation.navigate('VisitorDetails', { visitorId: visitor.id });
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const checkOutTime = new Date().toISOString();
      
      await updateDoc(visitorRef, {
        status: 'Out',
        checkOutTime,
        lastUpdated: checkOutTime,
      });

      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error checking out visitor:', error);
      Alert.alert('Error', 'Failed to check out visitor. Please try again.');
    }
  };

  const renderVisitorCard = ({ item: visitor }: { item: VisitorLogData }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleVisitorPress(visitor)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.visitorInfo}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={visitor.type === 'cab' ? 'car' : 'person'} 
              size={24} 
              color="#6B46C1" 
            />
          </View>
          <View>
            <Text style={styles.visitorName}>{visitor.name}</Text>
            <Text style={styles.visitorContact}>{visitor.contactNumber}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          visitor.status === 'In' ? styles.statusIn : 
          visitor.status === 'Out' ? styles.statusOut :
          styles.statusPending
        ]}>
          <Text style={[
            styles.statusText,
            { color: visitor.status === 'In' ? '#15803D' : 
                     visitor.status === 'Out' ? '#B91C1C' : 
                     '#B45309' }
          ]}>
            {visitor.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.detailColumn}>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#6B46C1" />
            <Text style={styles.detailLabel}>Check In:</Text>
            <Text style={styles.detailValue}>
              {visitor.checkInTime ? format(new Date(visitor.checkInTime), 'hh:mm a') : 'Not checked in'}
            </Text>
          </View>

          {visitor.whomToMeet && (
            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color="#6B46C1" />
              <Text style={styles.detailLabel}>Meeting:</Text>
              <Text style={styles.detailValue}>{visitor.whomToMeet}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailColumn}>
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={16} color="#6B46C1" />
            <Text style={styles.detailLabel}>Purpose:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{visitor.purpose}</Text>
          </View>

          {visitor.department && (
            <View style={styles.detailRow}>
              <Ionicons name="business" size={16} color="#6B46C1" />
              <Text style={styles.detailLabel}>Dept:</Text>
              <Text style={styles.detailValue}>{visitor.department}</Text>
            </View>
          )}
        </View>
      </View>

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
                  onPress: () => handleCheckOut(visitor.id)
                }
              ]
            );
          }}
        >
          <Ionicons name="exit-outline" size={20} color="#fff" />
          <Text style={styles.checkOutButtonText}>Check Out</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const applyFilters = (data: VisitorLogData[]) => {
    let filteredData = [...data];

    // Apply status filters
    if (selectedFilters.status.length > 0) {
      filteredData = filteredData.filter(visitor => 
        selectedFilters.status.includes(visitor.status)
      );
    }

    // Apply department filters
    if (selectedFilters.department.length > 0) {
      filteredData = filteredData.filter(visitor => 
        selectedFilters.department.includes(visitor.department)
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(visitor => 
        visitor.name.toLowerCase().includes(query) ||
        visitor.contactNumber.includes(query) ||
        visitor.purpose.toLowerCase().includes(query) ||
        visitor.department.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (selectedFilters.sortBy) {
      filteredData.sort((a, b) => {
        switch (selectedFilters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'checkInTime':
            return new Date(b.checkInTime || 0).getTime() - new Date(a.checkInTime || 0).getTime();
          case 'status':
            return a.status.localeCompare(b.status);
          case 'department':
            return a.department.localeCompare(b.department);
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  // Update the FlatList data to use filtered visitors
  const filteredVisitors = applyFilters(visitors);

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
          <TouchableOpacity 
            onPress={() => setIsFilterOpen(!isFilterOpen)}
            style={styles.filterButton}
          >
            <Ionicons name="filter" size={24} color="#374151" />
            {(selectedFilters.status.length > 0 || 
              selectedFilters.department.length > 0 || 
              selectedFilters.sortBy) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
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
          <Text style={styles.noVisitorsText}>No visitors found</Text>
        </View>
      )}

      <FilterSidebar
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={selectedFilters}
        onFilterChange={setSelectedFilters}
      />
    </SafeAreaView>
  );
};

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
  filterButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  card: {
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: '#FEE2E2',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailColumn: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVisitorsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  checkOutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B46C1',
  },
});

export default VisitorLog;
