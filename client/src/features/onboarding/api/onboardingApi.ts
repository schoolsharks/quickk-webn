import { api } from '../../../app/api';

export interface Feature {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface OnboardingData {
    companyName: string;
    adminName: string;
    adminEmail: string;
    selectedFeatures: string[];
}

export interface CompanyFeature {
    _id: string;
    company: string;
    features: Feature[];
}

export const onboardingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        completeOnboarding: builder.mutation<any, OnboardingData>({
            query: (onboardingData) => ({
                url: '/onboarding/complete',
                method: 'POST',
                body: onboardingData,
            }),
            invalidatesTags: ['Admin', 'Company'],
        }),

        getAllFeatures: builder.query<{ success: boolean; data: Feature[] }, void>({
            query: () => ({
                url: '/onboarding/features',
                method: 'GET',
            }),
            providesTags: ['Features'],
        }),

        getCompanyFeatures: builder.query<{ success: boolean; data: CompanyFeature }, void>({
            query: () => ({
                url: '/onboarding/company-features',
                method: 'GET',
            }),
            providesTags: ['CompanyFeatures'],
        }),
    }),
});

export const {
    useCompleteOnboardingMutation,
    useGetAllFeaturesQuery,
    useGetCompanyFeaturesQuery,
} = onboardingApi;