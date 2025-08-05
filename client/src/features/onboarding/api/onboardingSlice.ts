import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OnboardingState {
    currentStep: number;
    companyInfo: {
        companyName: string;
        companyCode: string;
    };
    adminInfo: {
        adminId?: string;
        adminName: string;
        adminEmail: string;
    };
    selectedFeatures: string[];
    emailExists: boolean;
    loading: boolean;
    error: string | null;
    preferences: {
        features: string[];
    };
}

const initialState: OnboardingState = {
    currentStep: 1,
    companyInfo: {
        companyName: '',
        companyCode: '',
    },
    adminInfo: {
        adminId: ' ',
        adminName: '',
        adminEmail: '',
    },
    selectedFeatures: [],
    emailExists: false,
    loading: false,
    error: null,
    preferences: {
        features: [],
    },
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setCurrentStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        setCompanyInfo(state, action: PayloadAction<{ companyName: string; companyCode: string }>) {
            state.companyInfo = action.payload;
        },
        setAdminInfo(state, action: PayloadAction<{ adminId: string, adminName: string; adminEmail: string }>) {
            state.adminInfo = action.payload;
        },
        setSelectedFeatures(state, action: PayloadAction<string[]>) {
            state.selectedFeatures = action.payload;
        },
        toggleFeature(state, action: PayloadAction<string>) {
            const featureId = action.payload;
            if (state.selectedFeatures.includes(featureId)) {
                state.selectedFeatures = state.selectedFeatures.filter(id => id !== featureId);
            } else {
                state.selectedFeatures.push(featureId);
            }
        },
        setEmailExists(state, action: PayloadAction<boolean>) {
            state.emailExists = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setPreferences(state, action: PayloadAction<{ features: string[] }>) {
            state.preferences = action.payload;
        },
        resetOnboarding(_state) {
            return initialState;
        },
    },
});

export const {
    setCurrentStep,
    setCompanyInfo,
    setAdminInfo,
    setSelectedFeatures,
    toggleFeature,
    setEmailExists,
    setLoading,
    setError,
    setPreferences,
    resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;