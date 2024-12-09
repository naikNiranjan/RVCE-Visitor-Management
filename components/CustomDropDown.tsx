import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

interface CustomDropDownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
}

export function CustomDropDown({ label, value, onValueChange, items }: CustomDropDownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label={`Select ${label}`} value="" />
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}
