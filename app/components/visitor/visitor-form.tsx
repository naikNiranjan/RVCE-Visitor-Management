import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Dropdown } from '../ui/dropdown';
import { Checkbox } from '../ui/checkbox';
import { departments, documentTypes, staff } from '../../constants/visitor-data';
import { AdditionalDetailsFormData } from '../../types/visitor';

interface Props {
  formData: AdditionalDetailsFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdditionalDetailsFormData>>;
  renderBefore?: () => ReactNode;
  renderAfter?: () => ReactNode;
}

export function VisitorForm({ formData, setFormData, renderBefore, renderAfter }: Props) {
  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        {renderBefore?.()}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visitor Details</Text>
        <Dropdown
          value={formData.whomToMeet}
          onValueChange={(value) => setFormData(prev => ({ ...prev, whomToMeet: value }))}
          options={staff}
          placeholder="Whom to Meet *"
          icon="person-pin"
        />

        <Dropdown
          value={formData.department}
          onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
          options={departments}
          placeholder="Department *"
          icon="business"
        />

        <Dropdown
          value={formData.documentType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}
          options={documentTypes}
          placeholder="Document Type *"
          icon="description"
        />
      </View>

      <View style={styles.section}>
        {renderAfter?.()}
      </View>

      <View style={styles.section}>
        <Checkbox
          value={formData.sendNotification}
          onValueChange={(value) => setFormData(prev => ({ ...prev, sendNotification: value }))}
          label="Send notification to host for approval"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    marginLeft: 4,
  },
}); 