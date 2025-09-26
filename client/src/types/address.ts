// Address autocomplete types for Nominatim API

export interface NominatimPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

export interface AddressOption {
  id: number;
  label: string;
  mainText: string;
  secondaryText: string;
  fullAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: number;
}

export interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, addressData?: AddressOption) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  sx?: any;
}

export interface UseAddressAutocompleteReturn {
  suggestions: AddressOption[];
  isLoading: boolean;
  error: string | null;
  searchAddress: (query: string) => void;
  clearSuggestions: () => void;
}