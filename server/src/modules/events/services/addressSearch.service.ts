import axios from 'axios';

interface NominatimPlace {
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

interface AddressOption {
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

export class AddressSearchService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
  private static readonly USER_AGENT = 'QuickkWebApp/1.0';

  /**
   * Search addresses using Nominatim API
   */
  async searchAddresses(query: string): Promise<AddressOption[]> {
    if (!query || query.trim().length < 3) {
      return [];
    }

    try {
      const params = {
        q: query.trim(),
        format: 'json',
        limit: '8',
        addressdetails: '1',
        countrycodes: 'in', // Focus on India
      };

      const response = await axios.get(AddressSearchService.NOMINATIM_BASE_URL, {
        params,
        headers: {
          'User-Agent': AddressSearchService.USER_AGENT,
        },
        timeout: 5000, // 5 second timeout
      });

      if (!Array.isArray(response.data)) {
        return [];
      }

      return this.transformNominatimResponse(response.data);
    } catch (error: any) {
      console.error('Address search error:', error.message);
      throw new Error('Failed to fetch address suggestions');
    }
  }

  /**
   * Transform Nominatim response to our AddressOption format
   */
  private transformNominatimResponse(places: NominatimPlace[]): AddressOption[] {
    return places.map((place) => {
      // Split display_name to get main and secondary text
      const parts = place.display_name.split(', ');
      const mainText = parts[0] || place.name;
      const secondaryText = parts.slice(1).join(', ');

      return {
        id: place.place_id,
        label: place.display_name,
        mainText,
        secondaryText,
        fullAddress: place.display_name,
        coordinates: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        },
        placeId: place.place_id,
      };
    });
  }
}