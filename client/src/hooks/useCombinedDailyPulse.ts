import { useMemo } from 'react';
import { 
  useGetDailyPulseQuery, 
  useGetConnectionFeedbackPulseQuery,
  useGetResourceRatingPulseQuery
} from '../features/dailyPulse/dailyPulseApi';

export interface ExtendedPulseItem {
  id: string;
  type: string;
  score: number;
  response?: string;
  // Regular daily pulse properties
  title?: string;
  content?: string;
  wantFeedback?: boolean;
  feedback?: string;
  questionText?: string;
  image?: string;
  optionType?: string;
  options?: string[];
  questionOptions?: string[];
  pulseStats?: any;
  // Connection feedback properties
  connectionUserId?: string;
  connectionUserName?: string;
  createdAt?: string;
  expiresAt?: string;
  // Resource rating properties
  resourceId?: string;
  resourceName?: string;
  companyName?: string;
  claimedAt?: string;
}

export interface CombinedDailyPulseData {
  date?: string;
  pulseItems: ExtendedPulseItem[];
  hasConnectionFeedback: boolean;
  hasResourceRating: boolean;
  isLoading: boolean;
  error: any;
}

/**
 * Hook that combines regular daily pulse with connection feedback pulse
 */
export const useCombinedDailyPulse = (): CombinedDailyPulseData => {
  const {
    data: dailyPulseData,
    isLoading: isDailyPulseLoading,
    error: dailyPulseError,
  } = useGetDailyPulseQuery({});

  const {
    data: connectionFeedbackData,
    isLoading: isConnectionFeedbackLoading,
    error: connectionFeedbackError,
  } = useGetConnectionFeedbackPulseQuery({});

  const {
    data: resourceRatingData,
    isLoading: isResourceRatingLoading,
    error: resourceRatingError,
  } = useGetResourceRatingPulseQuery({});

  const combinedData = useMemo(() => {
    const pulseItems: ExtendedPulseItem[] = [];
    let hasConnectionFeedback = false;
    let hasResourceRating = false;

    // Add regular daily pulse items
    if (dailyPulseData?.pulseItems) {
      pulseItems.push(...dailyPulseData.pulseItems);
    }

    // Add connection feedback pulse if available
    if (connectionFeedbackData?.data) {
      hasConnectionFeedback = true;
      const connectionPulse: ExtendedPulseItem = {
        id: connectionFeedbackData.data.id,
        type: 'connectionFeedback',
        score: connectionFeedbackData.data.score,
        connectionUserId: connectionFeedbackData.data.connectionUserId,
        connectionUserName: connectionFeedbackData.data.connectionUserName,
        questionText: connectionFeedbackData.data.questionText,
        options: connectionFeedbackData.data.options,
        createdAt: connectionFeedbackData.data.createdAt,
        expiresAt: connectionFeedbackData.data.expiresAt,
      };
      
      // Add connection feedback at the beginning so it appears first
      pulseItems.unshift(connectionPulse);
    }

    // Add resource rating pulse if available
    if (resourceRatingData?.data) {
      hasResourceRating = true;
      const resourceRatingPulse: ExtendedPulseItem = {
        id: resourceRatingData.data.id,
        type: 'resourceRating',
        score: resourceRatingData.data.score,
        resourceId: resourceRatingData.data.resourceId,
        resourceName: resourceRatingData.data.resourceName,
        companyName: resourceRatingData.data.companyName,
        claimedAt: resourceRatingData.data.claimedAt,
        expiresAt: resourceRatingData.data.expiresAt,
      };
      
      // Add resource rating at the beginning (or after connection feedback)
      pulseItems.unshift(resourceRatingPulse);
    }

    return {
      date: dailyPulseData?.date,
      pulseItems,
      hasConnectionFeedback,
      hasResourceRating,
      isLoading: isDailyPulseLoading || isConnectionFeedbackLoading || isResourceRatingLoading,
      error: dailyPulseError || connectionFeedbackError || resourceRatingError,
    };
  }, [
    dailyPulseData,
    connectionFeedbackData,
    resourceRatingData,
    isDailyPulseLoading,
    isConnectionFeedbackLoading,
    isResourceRatingLoading,
    dailyPulseError,
    connectionFeedbackError,
    resourceRatingError,
  ]);

  return combinedData;
};