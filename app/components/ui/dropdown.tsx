import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  value, 
  onValueChange, 
  options, 
  placeholder = 'Select an option',
  icon 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && (
          <MaterialIcons 
            name={icon} 
            size={20} 
            color="#6B46C1" 
            style={styles.icon} 
          />
        )}
        <Text style={styles.label}>{placeholder}</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#6B46C1"
          accessibilityLabel={`Dropdown for ${placeholder}`}
        >
          <Picker.Item 
            label={`Select ${placeholder}`} 
            value="" 
            style={styles.placeholderItem}
          />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              style={styles.item}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  icon: {
    marginRight: 8,
  },
  pickerContainer: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginHorizontal: -8,
  },
  placeholderItem: {
    color: '#666',
  },
  item: {
    color: '#1a1a1a',
  },
});
