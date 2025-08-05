import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { FeatureKeys } from '../Types/features';

export const useFeatureAccess = () => {
    const { selectedFeatures, preferences } = useSelector(
        (state: RootState) => state.onboarding
    );

    const hasFeatureAccess = (featureId?: FeatureKeys): boolean => {
        // Check both selectedFeatures and preferences.features for backward compatibility
        if (!featureId) return true;
        return selectedFeatures.includes(featureId) ||
            preferences.features.includes(featureId);
    };

    const hasRouteAccess = (route: string): boolean => {
        // Map routes to their corresponding features
        const routeFeatureMap: Record<string, FeatureKeys> = {
            '/admin/learnings/modules': FeatureKeys.MODULES,
            '/admin/learnings/dailyInteraction': FeatureKeys.DAILYPULSE,
            '/admin/rewards': FeatureKeys.REWARDS,
            '/admin/analytics': FeatureKeys.ANALYTICS,
        };

        // Check if route starts with any of the mapped routes
        const featureKey = Object.keys(routeFeatureMap).find(key =>
            route.startsWith(key)
        );

        if (!featureKey) return true; // Allow access to unmapped routes
        return hasFeatureAccess(routeFeatureMap[featureKey]);
    };

    const getEnabledFeatures = (): FeatureKeys[] => {
        return Object.values(FeatureKeys).filter(feature =>
            hasFeatureAccess(feature)
        );
    };

    return {
        hasFeatureAccess,
        hasRouteAccess,
        getEnabledFeatures,
        selectedFeatures,
    };
};