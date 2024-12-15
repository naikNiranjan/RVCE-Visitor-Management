export const CAB_PROVIDERS = [
  { label: 'Uber', value: 'UBER' },
  { label: 'Ola', value: 'OLA' },
  { label: 'Meru', value: 'MERU' },
  { label: 'Company Cab', value: 'COMPANY' },
  { label: 'Other', value: 'OTHER' },
];

export type CabProvider = typeof CAB_PROVIDERS[number]['value']; 