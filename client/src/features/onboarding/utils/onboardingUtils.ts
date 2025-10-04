import { OnboardingState } from '../api/onboardingSlice';

export const getStepTitle = (step: number): string => {
    const titles = {
        1: 'Company Information',
        2: 'Admin Information', 
        3: 'Select Features',
        4: 'Setup Complete'
    };
    return titles[step as keyof typeof titles] || 'Unknown Step';
};

export const getStepDescription = (step: number): string => {
    const descriptions = {
        1: 'Let\'s start by setting up your company profile',
        2: 'Now, let\'s create your administrator account',
        3: 'Choose the features you want to enable for your company',
        4: 'Your account has been successfully created!'
    };
    return descriptions[step as keyof typeof descriptions] || '';
};

export const calculateProgress = (currentStep: number, totalSteps: number = 4): number => {
    return Math.round((currentStep / totalSteps) * 100);
};

export const isOnboardingComplete = (state: OnboardingState): boolean => {
    return !!(
        state.companyInfo.companyName &&
        state.companyInfo.companyCode &&
        state.adminInfo.adminName &&
        state.adminInfo.adminEmail &&
        state.selectedFeatures.length > 0
    );
};

export const getOnboardingSummary = (state: OnboardingState) => {
    return {
        company: {
            name: state.companyInfo.companyName,
            code: state.companyInfo.companyCode
        },
        admin: {
            name: state.adminInfo.adminName,
            email: state.adminInfo.adminEmail
        },
        features: {
            count: state.selectedFeatures.length,
            selected: state.selectedFeatures
        },
        progress: calculateProgress(state.currentStep),
        isComplete: isOnboardingComplete(state)
    };
};

export const validateStep = (step: number, state: OnboardingState): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
        case 1:
            if (!state.companyInfo.companyName.trim()) errors.push('Company name is required');
            if (!state.companyInfo.companyCode.trim()) errors.push('Company code is required');
            break;
        case 2:
            if (!state.adminInfo.adminName.trim()) errors.push('Admin name is required');
            if (!state.adminInfo.adminEmail.trim()) errors.push('Admin email is required');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.adminInfo.adminEmail)) {
                errors.push('Please enter a valid email address');
            }
            break;
        case 3:
            if (state.selectedFeatures.length === 0) errors.push('Please select at least one feature');
            break;
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Feature utility functions
export const getFeatureIcon = (featureName: string): string => {
    const icons: Record<string, string> = {
        'Modules': '📚',
        'Daily Pulse': '💓',
        'Rewards': '🏆',
        'Quickk AI': '🤖'
    };
    return icons[featureName] || '⭐';
};

export const getFeatureColor = (featureName: string): string => {
    const colors: Record<string, string> = {
        'Modules': '#4CAF50',
        'Daily Pulse': '#FF6B6B',
        'Rewards': '#FFD93D',
        'Quickk AI': '#6C5CE7'
    };
    return colors[featureName] || 'primary.main';
};

// Local storage utilities for onboarding state persistence
export const saveOnboardingProgress = (state: OnboardingState): void => {
    try {
        localStorage.setItem('quickk_onboarding_progress', JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save onboarding progress:', error);
    }
};

export const loadOnboardingProgress = (): Partial<OnboardingState> | null => {
    try {
        const saved = localStorage.getItem('quickk_onboarding_progress');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.warn('Failed to load onboarding progress:', error);
        return null;
    }
};

export const clearOnboardingProgress = (): void => {
    try {
        localStorage.removeItem('quickk_onboarding_progress');
    } catch (error) {
        console.warn('Failed to clear onboarding progress:', error);
    }
};