import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from './components/SearchBar';
import { VisitorTable } from './components/VisitorTable';
import { FilterSidebar } from './components/FilterSideBar';

export interface VisitorData {
  id: string;
  name: string;
  checkInTime: string;
  checkOutTime: string | null;
  purpose: string;
  hostName: string;
  status: 'checked-in' | 'checked-out';
}

export const VisitorLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [] as string[],
    department: [] as string[],
    sortBy: null,
    sortOrder: 'asc' as const,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
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
      
      <VisitorTable searchQuery={searchQuery} filters={selectedFilters} />
      
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
});

export default VisitorLog;
