import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Dropdown } from '../ui/dropdown';
import { Checkbox } from '../ui/checkbox';
import { departments, documentTypes, staff } from '../../constants/visitor-data';
import { AdditionalDetailsFormData } from '../../types/visitor';
import { InputHint } from '../ui/input-hint';
import { validateField } from '../../utils/validation';

interface Props {
  formData: AdditionalDetailsFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdditionalDetailsFormData>>;
  renderBefore?: () => ReactNode;
  renderAfter?: () => ReactNode;
  errors?: Record<string, string>;
}

export function VisitorForm({ 
  formData, 
  setFormData, 
  renderBefore, 
  renderAfter,
  errors = {} 
}: Props) {
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
        
        <View style={styles.inputWrapper}>
          <Dropdown
            value={formData.whomToMeet}
            onValueChange={(value) => setFormData(prev => ({ ...prev, whomToMeet: value }))}
            options={staff}
            placeholder="Whom to Meet *"
            icon="person-pin"
            error={errors.whomToMeet}
          />
          <InputHint hint="Select the person you want to meet" />
        </View>

        <View style={styles.inputWrapper}>
          <Dropdown
            value={formData.department}
            onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            options={departments}
            placeholder="Department *"
            icon="business"
            error={errors.department}
          />
          <InputHint hint="Select the department you want to visit" />
        </View>

        <View style={styles.inputWrapper}>
          <Dropdown
            value={formData.documentType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}
            options={documentTypes}
            placeholder="Document Type *"
            icon="description"
            error={errors.documentType}
          />
          <InputHint hint="Select the type of ID you will provide" />
        </View>
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
  inputWrapper: {
    marginBottom: 16,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 8,
  },
}); 