import { ParamListBase } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  VisitorRegistration: undefined;
  VisitorAdditionalDetails: {
    formData: {
      name: string;
      contact: string;
      purpose: string;
      department: string;
      meeting: string;
    };
  };
  VisitorSuccess: {
    formData: {
      name: string;
      contact: string;
      purpose: string;
      department: string;
      meeting: string;
    };
  };
};

export type BottomTabParamList = {
  Home: undefined;
  VisitorEntry: undefined;
  VisitorLog: undefined;
  More: undefined;
};

export type DrawerNavigationParamList = {
  Home: undefined;
  VisitorEntry: undefined;
  VisitorLog: undefined;
  More: undefined;
};
