import { useState, useEffect, useCallback, useRef } from 'react';
import { AddressOption, UseAddressAutocompleteReturn } from '../types/address';
import { useLazySearchAddressesQuery } from '../features/admin/service/adminApi';

const DEBOUNCE_DELAY = 300; // 300ms debounce
const MIN_QUERY_LENGTH = 3; // Minimum characters before searching

export const useAddressAutocomplete = (): UseAddressAutocompleteReturn => {
  const [SearchAddresses] = useLazySearchAddressesQuery();
  const [suggestions, setSuggestions] = useState<AddressOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Transform backend API response to our AddressOption format
  const transformBackendResponse = (addresses: AddressOption[]): AddressOption[] => {
    // Backend already returns the correct format, so just return as-is
    return addresses;
  };

  // Fetch address suggestions from backend API using RTK Query
  const fetchAddressSuggestions = useCallback(async (query: string) => {
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      // Use RTK Query's searchAddresses endpoint
      const response = await SearchAddresses({ q: query }).unwrap();

      // RTK Query response should already be the parsed JSON
      // Backend returns { success, message, data }
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error(response.message || 'Invalid response format');
      }
      console.log('Address search response:', response);
      const transformedSuggestions = transformBackendResponse(response.data);
      setSuggestions(transformedSuggestions);
    } catch (err: any) {
      // Handle RTK Query errors
      console.error('Address search error:', err);
      
      // RTK Query wraps errors, so we need to extract the message
      const errorMessage = err?.data?.message || err?.message || 'Failed to fetch address suggestions';
      setError(errorMessage);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [SearchAddresses]);

  // Debounced search function
  const searchAddress = useCallback((query: string) => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Clear suggestions for very short queries immediately
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Set loading state immediately for better UX
    setIsLoading(true);

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, DEBOUNCE_DELAY);
  }, [fetchAddressSuggestions]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchAddress,
    clearSuggestions,
  };
};