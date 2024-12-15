import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterSidebar } from './components/FilterSideBar';
import { collection, query, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
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
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const visitorRef = collection(db, 'visitors');
      const q = query(visitorRef, orderBy('checkInTime', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const visitorData: VisitorLogData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        visitorData.push({
          id: doc.id,
          name: data.name,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          purpose: data.purposeOfVisit,
          whomToMeet: data.additionalDetails?.whomToMeet || '',
          department: data.additionalDetails?.department || '',
          status: data.status,
          contactNumber: data.contactNumber,
          visitorPhotoUrl: data.additionalDetails?.visitorPhotoUrl,
          documentUrl: data.additionalDetails?.documentUrl,
          type: data.type || 'visitor',
          lastUpdated: data.lastUpdated,
        });
      });

      setVisitors(visitorData);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      // Refresh the visitor list
      fetchVisitors();
      
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

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.contactNumber.includes(searchQuery) ||
    visitor.purpose.toLowerCase().includes(searchQuery.toLowerCase())
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
          <TouchableOpacity 
            onPress={() => setIsFilterOpen(!isFilterOpen)}
            style={styles.filterButton}
          >
            <Ionicons name="filter" size={24} color="#374151" />
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
});

export default VisitorLog;
