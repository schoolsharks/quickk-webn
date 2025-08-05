import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSidebar from "../../components/layout/SideBar";
import BreadcrumbHeader from "../../components/layout/BreadcrumbHeader";
import Dashboard from "../admin/DashBoard";
import DailyPulse from "./DailyPulse";
import CreateDailyPulsePage from "./CreateDailyPulsePage";
import ReviewDailyPulsePage from "./ReviewDailyPulsePage";
import LearningLandingPage from "./LearningLandingPage";
import CreateLearningPage from "./CreateLearningPage";
import CreateNewModulePage from "./CreateNewModulePage";
import LoginAdmin from "../../features/auth/components/LoginAdmin";
import AuthWrapper from "../../features/auth/components/AuthWrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useLazyFetchAdminQuery } from "../../features/admin/service/adminApi";
import { Roles } from "../../features/auth/authSlice";
import OnboardingMain from "../../features/onboarding/pages/OnboardingMain";
import QuickkAiPage from "./QuickkAiPage";
import UserPage from "./UserPage";
import ReviewUserPage from "./ReviewUserPage";
import FeatureGuard from "../../features/onboarding/components/FeatureGuard";
import { FeatureKeys } from "../../features/onboarding/Types/features";
// import RouteGuard from "../../features/onboarding/components/RouteGuard";
import { setPreferences } from "../../features/onboarding/api/onboardingSlice";
import { useDispatch } from "react-redux";

const Rewards = () => (
  <FeatureGuard feature={FeatureKeys.REWARDS}>
    <Box sx={{ p: 3 }}>
      <h1>Rewards</h1>
      <p>Rewards content goes here</p>
    </Box>
  </FeatureGuard>
);

const Analytics = () => (
  <FeatureGuard feature={FeatureKeys.ANALYTICS}>
    <Box sx={{ p: 3 }}>
      <h1>Analytics</h1>
      <p>Analytics content goes here</p>
    </Box>
  </FeatureGuard>
);

const Settings = () => (
  <Box sx={{ p: 3 }}>
    <h1>Settings</h1>
    <p>Settings content goes here</p>
  </Box>
);

const AdminMain: React.FC = () => {
  const [fetchAdmin] = useLazyFetchAdminQuery();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchAdmin({})
      .unwrap()
      .then((result: any) => {
        const preferences = result?.data.companyFeature.features.map(
          (feature: any) => {
            return feature?.name
              ?.split(" ")
              .map((word: string, index: number) =>
                index === 0
                  ? word.charAt(0).toLowerCase() + word.slice(1)
                  : word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join("");
          }
        );
        dispatch(setPreferences({ features: preferences }));
      });
  }, [isAuthenticated]);

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/onboarding" element={<OnboardingMain />} />
      <Route path="/login" element={<LoginAdmin />} />
      <Route
        path="/"
        element={
          <AuthWrapper verifyRole={Roles.ADMIN} redirection="/admin/login" />
        }
      >
        <Route
          path="*"
          element={
            <Box
              sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "background.default",
              }}
            >
              <AdminSidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  backgroundColor: "rgba(37, 37, 37, 1)",
                  minHeight: "100vh",
                }}
              >
                <BreadcrumbHeader />
                {/* <RouteGuard> */}
                <Routes>
                  <Route path="/impact-dashboard" element={<Dashboard />} />

                  {/* Learning routes */}
                  <Route
                    path="/learnings/modules"
                    element={
                      <FeatureGuard feature={FeatureKeys.MODULES}>
                        <LearningLandingPage />
                      </FeatureGuard>
                    }
                  />
                  <Route
                    path="/learnings/create/:learningId"
                    element={
                      <FeatureGuard feature={FeatureKeys.MODULES}>
                        <CreateLearningPage />
                      </FeatureGuard>
                    }
                  />
                  <Route
                    path="/learnings/create-module/:moduleId"
                    element={
                      <FeatureGuard feature={FeatureKeys.MODULES}>
                        <CreateNewModulePage />
                      </FeatureGuard>
                    }
                  />

                  {/* Daily Pulse routes */}
                  <Route
                    path="/learnings/dailyInteraction"
                    element={
                      <FeatureGuard feature={FeatureKeys.DAILYPULSE}>
                        <DailyPulse />
                      </FeatureGuard>
                    }
                  />
                  <Route
                    path="/learnings/dailyInteraction/create"
                    element={
                      <FeatureGuard feature={FeatureKeys.DAILYPULSE}>
                        <CreateDailyPulsePage />
                      </FeatureGuard>
                    }
                  />
                  <Route
                    path="/learnings/dailyInteraction/review/:dailyPulseId"
                    element={
                      // <FeatureGuard feature={FeatureKeys.DAILYPULSE}>
                      <ReviewDailyPulsePage />
                      // </FeatureGuard>
                    }
                  />
                  {/* Quickk Ai routes */}

                  <Route
                    path="/quickk-ai"
                    element={
                      <FeatureGuard feature={FeatureKeys.QUICKKAI}>
                        <QuickkAiPage />
                      </FeatureGuard>
                    }
                  />
                  <Route
                    path="/quickk-ai/:chatId"
                    element={
                      <FeatureGuard feature={FeatureKeys.QUICKKAI}>
                        <QuickkAiPage />
                      </FeatureGuard>
                    }
                  />

                  {/* Users Routes */}
                  <Route path="/users" element={<UserPage />} />
                  <Route path="/user/:userId" element={<ReviewUserPage />} />

                  <Route
                    path="/rewards"
                    element={
                      <FeatureGuard feature={FeatureKeys.REWARDS}>
                        <Rewards />
                      </FeatureGuard>
                    }
                  />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="/"
                    element={<Navigate to="/admin/impact-dashboard" replace />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/impact-dashboard" replace />}
                  />
                </Routes>
                {/* </RouteGuard> */}
              </Box>
            </Box>
          }
        />
      </Route>
    </Routes>
  );
};

export default AdminMain;
