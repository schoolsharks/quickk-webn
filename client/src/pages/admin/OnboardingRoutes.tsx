// features/onboarding/routes/OnboardingRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import OnboardingMain from "../../features/onboarding/pages/OnboardingMain";

const OnboardingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<OnboardingMain />} />
      <Route path="/onboarding" element={<OnboardingMain />} />
    </Routes>
  );
};

export default OnboardingRoutes;
