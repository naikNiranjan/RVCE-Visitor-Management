export interface VisitorData {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  purposeOfVisit: string;
  vehicleNumber: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'In' | 'Out' | 'pending';
  additionalDetails?: {
    whomToMeet: string;
    department: string;
    documentType: string;
    visitorCount: number;
    visitorPhotoUrl?: string;
    documentUrl?: string;
  };
}

export interface VisitorFormData {
  name: string;
  address: string;
  contactNumber: string;
  vehicleNumber: string;
  purposeOfVisit: string;
  typeOfVisit: string;
}

export interface AdditionalDetailsFormData {
  whomToMeet: string;
  department: string;
  documentType: string;
  documentUri: string;
  visitorPhotoUri: string;
  sendNotification: boolean;
  visitorCount: number;
  visitorPhotoUrl?: string;
  documentUrl?: string;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export type RootStackParamList = {
  VisitorRegistration: undefined;
  VisitorAdditionalDetails: {
    formData: VisitorFormData;
    visitorId: string;
  };
  VisitorSuccess: {
    formData: VisitorFormData & AdditionalDetailsFormData;
    visitorId: string;
  };
  VisitorLog: undefined;
}; 