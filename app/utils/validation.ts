interface FormErrors {
  name?: string;
  address?: string;
  contactNumber?: string;
  vehicleNumber?: string;
  purposeOfVisit?: string;
  typeOfVisit?: string;
  // Additional details form fields
  idType?: string;
  idNumber?: string;
  temperature?: string;
  company?: string;
  personToMeet?: string;
  department?: string;
}

interface ValidationRules {
  name: (value: string) => string | undefined;
  address: (value: string) => string | undefined;
  contactNumber: (value: string) => string | undefined;
  vehicleNumber: (value: string) => string | undefined;
  purposeOfVisit: (value: string) => string | undefined;
  typeOfVisit: (value: string) => string | undefined;
  idType: (value: string) => string | undefined;
  idNumber: (value: string) => string | undefined;
  temperature: (value: string) => string | undefined;
  company: (value: string) => string | undefined;
  personToMeet: (value: string) => string | undefined;
  department: (value: string) => string | undefined;
}

const validationRules: ValidationRules = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required';
    if (!/^[a-zA-Z\s]{2,50}$/.test(value.trim())) {
      return 'Name should be 2-50 characters and contain only letters and spaces';
    }
    return undefined;
  },

  address: (value: string) => {
    if (value && value.trim().length < 5) return 'Address should be at least 5 characters';
    if (value && /[^\w\s,.\-/#()&]/.test(value)) {
      return 'Address contains invalid characters';
    }
    return undefined;
  },

  contactNumber: (value: string) => {
    if (!value) return 'Contact number is required';
    const cleanNumber = value.replace(/[^0-9]/g, '');
    if (cleanNumber.length !== 10) return 'Contact number must be 10 digits';
    return undefined;
  },

  vehicleNumber: (value: string) => {
    if (!value) return undefined; // Optional field
    const cleanVehicleNumber = value.replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/.test(cleanVehicleNumber)) {
      return 'Invalid vehicle number format (e.g., KA01AB1234)';
    }
    return undefined;
  },

  purposeOfVisit: (value: string) => {
    if (!value.trim()) return 'Purpose of visit is required';
    if (value.trim().length < 10) return 'Purpose should be at least 10 characters';
    if (value.trim().length > 200) return 'Purpose should not exceed 200 characters';
    return undefined;
  },

  typeOfVisit: (value: string) => {
    const validTypes = ['Personal', 'Business', 'Official', 'Other'];
    if (!validTypes.includes(value)) {
      return 'Please select a valid visit type';
    }
    return undefined;
  },

  // Additional details validation rules
  idType: (value: string) => {
    const validIdTypes = ['Passport', 'Driving License', 'National ID', 'Other'];
    if (!value) return 'ID type is required';
    if (!validIdTypes.includes(value)) {
      return 'Please select a valid ID type';
    }
    return undefined;
  },

  idNumber: (value: string) => {
    if (!value.trim()) return 'ID number is required';
    if (value.trim().length < 4) return 'ID number should be at least 4 characters';
    if (!/^[A-Z0-9-/]{4,20}$/i.test(value.trim())) {
      return 'Invalid ID number format';
    }
    return undefined;
  },

  temperature: (value: string) => {
    if (!value) return 'Temperature is required';
    const temp = parseFloat(value);
    if (isNaN(temp) || temp < 35 || temp > 42) {
      return 'Temperature must be between 35°C and 42°C';
    }
    return undefined;
  },

  company: (value: string) => {
    if (!value.trim()) return 'Company name is required';
    if (value.trim().length < 2) return 'Company name should be at least 2 characters';
    if (!/^[a-zA-Z0-9\s&.,'-]{2,50}$/.test(value.trim())) {
      return 'Invalid company name format';
    }
    return undefined;
  },

  personToMeet: (value: string) => {
    if (!value.trim()) return 'Person to meet is required';
    if (!/^[a-zA-Z\s]{2,50}$/.test(value.trim())) {
      return 'Person name should be 2-50 characters and contain only letters and spaces';
    }
    return undefined;
  },

  department: (value: string) => {
    if (!value.trim()) return 'Department is required';
    if (value.trim().length < 2) return 'Department should be at least 2 characters';
    if (!/^[a-zA-Z0-9\s&-]{2,50}$/.test(value.trim())) {
      return 'Invalid department name format';
    }
    return undefined;
  },
};

export function validateField(field: keyof FormErrors, value: string): string | undefined {
  return validationRules[field](value);
}

export function validateForm(formData: Record<string, string>): FormErrors {
  const errors: FormErrors = {};
  
  (Object.keys(formData) as Array<keyof FormErrors>).forEach((field) => {
    if (validationRules[field]) {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    }
  });

  return errors;
}

// Helper function to format input values
export const formatters = {
  vehicleNumber: (value: string): string => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  },
  
  contactNumber: (value: string): string => {
    return value.replace(/[^0-9]/g, '').slice(0, 10);
  },
  
  temperature: (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  },
}; 