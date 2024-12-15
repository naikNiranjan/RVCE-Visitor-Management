import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { DataTable } from 'react-native-paper';
import { collection, query, onSnapshot, where, Query, orderBy } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { VisitorData } from '../../types/visitor';
//import { VisitorDetails } from '../VisitorDetails';

interface VisitorTableProps {
  searchQuery: string;
  filters: {
    status: string[];
    department: string[];
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';
  };
}

interface StatusStyle extends ViewStyle {
  backgroundColor: string;
}

interface StatusStyles {
  checked_in: StatusStyle;
  checked_out: StatusStyle;
  pending: StatusStyle;
}

const StatusIndicator = ({ status }: { status: VisitorData['status'] }) => (
  <View style={[
    styles.statusDot,
    { backgroundColor: status === 'In' ? '#34D399' : '#EF4444' }
  ]} />
);

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function VisitorTable({ searchQuery, filters }: VisitorTableProps) {
  const navigation = useNavigation<NavigationProp>();
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFirestoreError = (error: any) => {
    if (error.code === 'failed-precondition') {
      // This is likely a missing index error
      console.error('Missing index:', error);
      return 'Missing Firestore index. Please wait while we set up the database.';
    } else if (error.code === 'permission-denied') {
      return 'Permission denied. Please check your authentication.';
    }
    return 'Failed to load visitors. Please try again.';
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Start with a basic query
      let baseQuery = collection(db, 'visitors');
      let constraints = [];

      // Handle date range filters first
      if (filters.dateRange?.startDate) {
        const startDate = new Date(filters.dateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        constraints.push(where('checkInTime', '>=', startDate.toISOString()));
      }

      if (filters.dateRange?.endDate) {
        const endDate = new Date(filters.dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        constraints.push(where('checkInTime', '<=', endDate.toISOString()));
      }

      // Add other filters with correct field paths
      if (filters.status.length > 0) {
        constraints.push(where('status', 'in', filters.status));
      }

      if (filters.department.length > 0) {
        constraints.push(where('additionalDetails.department', 'in', filters.department));
      }

      if (filters.purpose) {
        constraints.push(where('purposeOfVisit', '==', filters.purpose.toLowerCase()));
      }

      // Always add a default sort to ensure consistent ordering
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'name':
            constraints.push(orderBy('name', filters.sortOrder));
            break;
          case 'status':
            constraints.push(orderBy('status', filters.sortOrder));
            break;
          case 'checkInTime':
            constraints.push(orderBy('checkInTime', filters.sortOrder));
            break;
          default:
            constraints.push(orderBy('checkInTime', 'desc'));
        }
      } else {
        constraints.push(orderBy('checkInTime', 'desc'));
      }

      // Create and execute query
      const finalQuery = query(baseQuery, ...constraints);
      console.log('Query constraints:', constraints); // For debugging

      const unsubscribe = onSnapshot(
        finalQuery,
        {
          next: (snapshot) => {
            const visitorData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as VisitorData[];

            // Apply search filter client-side if needed
            let filteredVisitors = visitorData;
            if (searchQuery) {
              const searchLower = searchQuery.toLowerCase();
              filteredVisitors = visitorData.filter(visitor => 
                visitor.name?.toLowerCase().includes(searchLower) ||
                visitor.contactNumber?.toLowerCase().includes(searchLower) ||
                visitor.purposeOfVisit?.toLowerCase().includes(searchLower) ||
                visitor.additionalDetails?.whomToMeet?.toLowerCase().includes(searchLower)
              );
            }

            setVisitors(filteredVisitors);
            setError(null);
            setIsLoading(false);
          },
          error: (err) => {
            console.error('Firestore query error:', err);
            // Log the full error for debugging
            console.log('Full error object:', JSON.stringify(err));
            const errorMessage = handleFirestoreError(err);
            setError(errorMessage);
            setIsLoading(false);
          }
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up query:', err);
      setError('Failed to load visitors. Please try again.');
      setIsLoading(false);
    }
  }, [searchQuery, filters]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // This will trigger the useEffect hook to run again
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (visitors.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="search-outline" size={48} color="#6B7280" />
        <Text style={styles.emptyText}>No visitors found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {visitors.map((visitor) => (
        <TouchableOpacity 
          key={visitor.id} 
          style={styles.card}
          onPress={() => {
            console.log('Navigating to VisitorDetails with visitor:', visitor);
            navigation.navigate('VisitorDetails', { visitor });
          }}
        >
          <View style={styles.cardContent}>
            {/* Status Badge */}
            <View style={styles.statusBadgeContainer}>
              <Text style={[styles.statusValue, { backgroundColor: getStatusBackgroundColor(visitor.status) }]}>
                {visitor.status}
              </Text>
            </View>

            {/* Profile Image with Status Indicator */}
            <View style={styles.profileImageContainer}>
              <StatusIndicator status={visitor.status} />
              {visitor.additionalDetails?.visitorPhotoUrl ? (
                <Image 
                  source={{ uri: visitor.additionalDetails.visitorPhotoUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={24} color="#6B46C1" />
                </View>
              )}
            </View>

            {/* Visitor Info */}
            <View style={styles.visitorInfo}>
              <Text style={styles.purposeText}>
                {visitor.name}
              </Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#6B46C1" />
                <Text style={styles.timeText}>
                  {formatTime(visitor.checkInTime)}
                </Text>
              </View>
            </View>

            {/* Arrow Icon */}
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward-outline" size={24} color="#6B46C1" />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const getStatusBackgroundColor = (status: VisitorData['status']): string => {
  switch (status) {
    case 'In':
      return '#BCFDBD';
    case 'Out':
      return '#FDE8E8';
    default:
      return '#FEF3C7';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorInfo: {
    flex: 1,
    marginRight: 8,
  },
  purposeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    color: '#6B7280',
    
  },
  statusValue: {
    color: '#6B46C1',
    fontWeight: '500',
    height: 20,
    width: 50,
    borderRadius: 10,
    textAlign: 'center',
    padding: 2,
    fontSize: 12,
    marginRight:35
  },
  arrowContainer: {
    padding: 4,
    marginLeft: 'auto',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statusDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
}); 