import { VisitorData } from './visitor';

export type RootStackParamList = {
  Home: undefined;
  VisitorLog: undefined;
  VisitorDetails: {
    visitor: VisitorData;
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
};

export type VisitorDetailsRouteProp = RouteProp<RootStackParamList, 'VisitorDetails'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 