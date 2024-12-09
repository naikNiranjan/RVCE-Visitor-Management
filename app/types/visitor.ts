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
}

export interface SuccessFormData {
  name: string;
  contactNumber: string;
  purposeOfVisit: string;
  whomToMeet: string;
  department: string;
}
