export interface VisitorFormData {
  address: string;
  contactNumber: string;
  vehicleNumber: string;
  purposeOfVisit: string;
  visitType: string;
}

export interface AdditionalDetailsFormData {
  whomToMeet: string;
  department: string;
  documentType: string;
  selectedStaff: string;
  sendNotification: boolean;
  documentUri?: string;
} 