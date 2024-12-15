export const CAB_PROVIDERS = [
  { label: 'Uber', value: 'uber' },
  { label: 'Ola', value: 'ola' },
  { label: 'Rapido', value: 'rapido' },
  { label: 'Other', value: 'other' }
] as const;

export type CabProvider = typeof CAB_PROVIDERS[number]['value']; 