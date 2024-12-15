import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  VisitorLog: undefined;
  VisitorDetails: {
    visitorId: string;
  };
  VisitorRegistration: undefined;
  VisitorAdditionalDetails: {
    formData: any;
    visitorId: string;
  };
  VisitorSuccess: {
    formData: any;
    visitorId: string;
  };
  EditProfile: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  Support: undefined;
  Profile: undefined;
  SignOut: undefined;
};

export type VisitorDetailsRouteProp = RouteProp<RootStackParamList, 'VisitorDetails'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 