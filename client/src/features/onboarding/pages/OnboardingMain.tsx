// features/onboarding/pages/OnboardingMain.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import AdminInfoPage from './AdminInfoPage';
import FeatureSelectionPage from './FeatureSelectionPage';
import OnboardingSuccess from './OnboardingSuccess';
import OnboardingLayout from '../components/OnboardingLayout';
import EmailVerificationPage from './EmailVerification';

const OnboardingMain: React.FC = () => {
    const { currentStep } = useSelector((state: RootState) => state.onboarding);

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <AdminInfoPage />;
            case 2:
                return <FeatureSelectionPage />;
            case 3:
                return <EmailVerificationPage />;
            case 4:
                return <OnboardingSuccess />;
            default:
                return <AdminInfoPage />;
        }
    };

    return (
        <OnboardingLayout>
            {renderCurrentStep()}
        </OnboardingLayout>
    );
};

export default OnboardingMain;