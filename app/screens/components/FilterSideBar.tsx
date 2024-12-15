import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { DateRangePicker } from '../../components/ui/date-range-picker'

interface FilterSidebarProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    status: string[];
    department: string[];
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';
  };
  onFilterChange: (filters: any) => void;
}

const statusOptions = [
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Checked Out', value: 'checked_out' },
  { label: 'Pending', value: 'pending' },
];

const departmentOptions = [
  { label: 'FIN', value: 'FIN' },
  { label: 'HR', value: 'HR' },
  { label: 'IT', value: 'IT' },
  { label: 'Admin', value: 'ADMIN' },
];

const purposeOptions = [
  { label: 'Meeting', value: 'meeting' },
  { label: 'Interview', value: 'interview' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Personal', value: 'personal' },
];

const sortOptions = [
  { label: 'Check-in Time', value: 'checkInTime' },
  { label: 'Visitor Name', value: 'name' },
  { label: 'Status', value: 'status' },
  { label: 'Department', value: 'additionalDetails.department' },
];

export function FilterSidebar({ visible, onClose, filters, onFilterChange }: FilterSidebarProps) {
  if (!visible) return null;

  const handleCheckboxChange = (type: string, value: string) => {
    const currentValues = filters[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [type]: newValues
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filters,
      sortBy: value,
      sortOrder: filters.sortBy === value && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    onFilterChange({
      ...filters,
      dateRange: { startDate, endDate }
    });
  };

  const isSelected = (type: string, value: string) => {
    return filters[type]?.includes(value);
  };

  return (
    <View style={[styles.container, styles.sidebar]}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => onFilterChange({
              status: [],
              department: [],
              sortBy: null,
              sortOrder: 'asc'
            })}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* Status Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          {statusOptions.map((option) => (
            <View key={option.value} style={styles.checkboxRow}>
              <Checkbox.Android
                status={isSelected('status', option.value) ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange('status', option.value)}
                color="#6B46C1"
              />
              <Text style={styles.checkboxLabel}>{option.label}</Text>
            </View>
          ))}
        </View>

        {/* Department Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Department</Text>
          {departmentOptions.map((option) => (
            <View key={option.value} style={styles.checkboxRow}>
              <Checkbox.Android
                status={isSelected('department', option.value) ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange('department', option.value)}
                color="#6B46C1"
              />
              <Text style={styles.checkboxLabel}>{option.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                filters.sortBy === option.value && styles.selectedOption,
              ]}
              onPress={() => handleSortChange(option.value)}
            >
              <Text style={[
                styles.sortOptionText,
                filters.sortBy === option.value && styles.selectedOptionText,
              ]}>
                {option.label}
                {filters.sortBy === option.value && (
                  <Ionicons 
                    name={filters.sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
                    size={16} 
                    color="#6B46C1" 
                  />
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '80%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  dateRangeContainer: {
    marginTop: 8,
  },
  selectedOption: {
    backgroundColor: '#F3F0FF',
  },
  selectedOptionText: {
    color: '#6B46C1',
    fontWeight: '600',
  },
  sortOption: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  sortOptionText: {
    fontSize: 14,
    color: '#374151',
  },
});