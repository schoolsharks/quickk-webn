import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import {
    setCurrentStep,
    setCompanyInfo,
    // setAdminInfo,
    setSelectedFeatures,
    toggleFeature,
    setLoading,
    setError,
    resetOnboarding
} from '../api/onboardingSlice';
import { useCompleteOnboardingMutation } from '../api/onboardingApi';

export const useOnboarding = () => {
    const dispatch = useDispatch();
    const onboardingState = useSelector((state: RootState) => state.onboarding);
    const [completeOnboardingMutation, { isLoading: isCompleting }] = useCompleteOnboardingMutation();

    const goToStep = (step: number) => {
        dispatch(setCurrentStep(step));
    };

    const nextStep = () => {
        dispatch(setCurrentStep(onboardingState.currentStep + 1));
    };

    const previousStep = () => {
        if (onboardingState.currentStep > 1) {
            dispatch(setCurrentStep(onboardingState.currentStep - 1));
        }
    };

    const updateCompanyInfo = (info: { companyName: string; companyCode: string }) => {
        dispatch(setCompanyInfo(info));
    };

    // const updateAdminInfo = (info: { admimId: string; adminName: string; adminEmail: string }) => {
    //     dispatch(setAdminInfo(info));
    // };

    const updateSelectedFeatures = (features: string[]) => {
        dispatch(setSelectedFeatures(features));
    };

    const toggleFeatureSelection = (featureId: string) => {
        dispatch(toggleFeature(featureId));
    };

    const completeOnboarding = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const result = await completeOnboardingMutation({
                companyName: onboardingState.companyInfo.companyName,
                // companyCode: onboardingState.companyInfo.companyCode,
                adminName: onboardingState.adminInfo.adminName,
                adminEmail: onboardingState.adminInfo.adminEmail,
                selectedFeatures: onboardingState.selectedFeatures,
            }).unwrap();

            dispatch(setCurrentStep(4));
            return result;
        } catch (error: any) {
            dispatch(setError(error.message || 'Setup failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const resetOnboardingFlow = () => {
        dispatch(resetOnboarding());
    };

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(onboardingState.companyInfo.companyName && onboardingState.companyInfo.companyCode);
            case 2:
                return !!(onboardingState.adminInfo.adminName && onboardingState.adminInfo.adminEmail);
            case 3:
                return onboardingState.selectedFeatures.length > 0;
            default:
                return false;
        }
    };

    const canProceedToNextStep = (): boolean => {
        return isStepValid(onboardingState.currentStep);
    };

    return {
        ...onboardingState,
        isCompleting,
        goToStep,
        nextStep,
        previousStep,
        updateCompanyInfo,
        // updateAdminInfo,
        updateSelectedFeatures,
        toggleFeatureSelection,
        completeOnboarding,
        resetOnboardingFlow,
        isStepValid,
        canProceedToNextStep,
    };
};

// Hook for form validation
export const useOnboardingValidation = () => {
    const { companyInfo, adminInfo, selectedFeatures } = useSelector((state: RootState) => state.onboarding);

    const validateCompanyInfo = () => {
        const errors: Record<string, string> = {};

        if (!companyInfo.companyName.trim()) {
            errors.companyName = 'Company name is required';
        }

        if (!companyInfo.companyCode.trim()) {
            errors.companyCode = 'Company code is required';
        } else if (companyInfo.companyCode.length < 3) {
            errors.companyCode = 'Company code must be at least 3 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    const validateAdminInfo = () => {
        const errors: Record<string, string> = {};

        if (!adminInfo.adminName.trim()) {
            errors.adminName = 'Admin name is required';
        }

        if (!adminInfo.adminEmail.trim()) {
            errors.adminEmail = 'Admin email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminInfo.adminEmail)) {
            errors.adminEmail = 'Please enter a valid email address';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    const validateFeatureSelection = () => {
        const errors: Record<string, string> = {};

        if (selectedFeatures.length === 0) {
            errors.features = 'Please select at least one feature';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    return {
        validateCompanyInfo,
        validateAdminInfo,
        validateFeatureSelection,
    };
};