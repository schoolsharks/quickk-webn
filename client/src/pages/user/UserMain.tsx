import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
// import OnboardingLayout from "../user/OnboardingLayout";
import Login from "../../features/auth/components/Login";
import Dashboard from "./Dashboard";
import AuthWrapper from "../../features/auth/components/AuthWrapper";
import { Roles } from "../../features/auth/authSlice";
import { useEffect } from "react";
import { useLazyFetchUserQuery } from "../../features/user/userApi";
import LearningPage from "./LearningPage";
import ModulePage from "./ModulePage";
import TimeToPracticePage from "./TimeToPracticePage";
import ModuleComplete from "./ModuleComplete";
import AssessmentPage from "./AssessmentPage";
import ProfilePage from "./ProfilePage";
import Reward from "./Reward";
import BuyRewardPage from "./BuyRewardPage";
import ResultPage from "./ResultPage";
import MyTicketsPage from "./MyTicketsPage";
import LeaderboardPage from "./LeaderboardPage";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import Loader from "../../components/ui/Loader";
import BuyConfiramtionPage from "./BuyConfiramtionPage";
import AvatarPage from "./AvatarPage";
import VideoComponentPage from "./VideoComponentPage";
import EventDashboard from "./EventDashboard";
import CompleteProfilePage from "./CompleteProfilePage";
import ModeSelection from "./ModeSelection";
import EventDetails from "../../features/events/pages/EventDetails";
import TicketPurchase from "../../features/events/pages/TicketPurchase";
import PurchaseSuccess from "../../features/events/pages/PurchaseSuccess";
import Referral from "./Referral";
import WebnMembershipPage from "./WebnMembershipPage";
import RewardsAndResources from "./RewardsAndResources";
import GetListed from "../../features/events/components/GetListed";

// Component to handle dashboard redirection based on event mode
const DashboardRedirect = () => {
  const { eventMode } = useSelector((state: RootState) => state.user);
  const [searchParams] = useSearchParams();

  // Preserve query parameters when redirecting
  const queryString = searchParams.toString();
  const redirectPath = queryString ? `?${queryString}` : "";

  if (eventMode) {
    return <Navigate to={`/user/event-mode${redirectPath}`} replace />;
  }

  return <Dashboard />;
};

// Component to handle initial redirection when user visits root
const InitialRedirect = () => {
  const { eventMode } = useSelector((state: RootState) => state.user);
  const [searchParams] = useSearchParams();

  // Check if user has already selected a mode
  const hasSelectedMode = localStorage.getItem("eventMode") !== null;

  // Preserve query parameters when redirecting
  const queryString = searchParams.toString();
  const redirectPath = queryString ? `?${queryString}` : "";

  if (!hasSelectedMode) {
    return <Navigate to={`/user/mode-selection${redirectPath}`} replace />;
  }

  if (eventMode) {
    return <Navigate to={`/user/event-mode${redirectPath}`} replace />;
  }

  return <Navigate to={`/user/dashboard${redirectPath}`} replace />;
};
const UserMain = () => {
  const [fetchUser] = useLazyFetchUserQuery();
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { totalStars } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchUser({});
  }, [isAuthenticated, totalStars]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: window.innerHeight,
        background: "#FFFFFF",
      }}
    >
      <Routes>
        {/* <Route index path="/onboarding" element={<OnboardingLayout />} /> */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthWrapper verifyRole={Roles.USER} redirection="/user/login" />
          }
        >
          <Route index element={<InitialRedirect />} />
          <Route path="dashboard" element={<DashboardRedirect />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="module/:moduleId" element={<ModulePage />} />
          <Route path="practice/:moduleId" element={<TimeToPracticePage />} />
          <Route
            path="moduleComplete/:currentModuleId"
            element={<ModuleComplete />}
          />
          <Route path="assessment/:moduleId" element={<AssessmentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reward" element={<Reward />} />
          <Route path="mytickets" element={<MyTicketsPage />} />
          <Route path="buyReward/:rewardId" element={<BuyRewardPage />} />
          <Route path="ticket-confirmation" element={<BuyConfiramtionPage />} />
          <Route path="result/:rewardId" element={<ResultPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="avatars" element={<AvatarPage />} />
          <Route path="video/:url" element={<VideoComponentPage />} />
          <Route path="complete-profile" element={<CompleteProfilePage />} />
          <Route path="mode-selection" element={<ModeSelection />} />

          {/* Event routes */}
          <Route path="events/:eventId" element={<EventDetails />} />
          <Route path="events/:eventId/purchase" element={<TicketPurchase />} />
          <Route path="events/:eventId/success" element={<PurchaseSuccess />} />

          {/* event mode route  */}
          <Route path="event-mode" element={<EventDashboard />} />
          <Route path="referral" element={<Referral />} />
          <Route path="rewards" element={<RewardsAndResources />} />
          <Route path="webn-membership" element={<WebnMembershipPage />} />
          <Route path="get-listed" element={<GetListed />} />
        </Route>
        <Route path="*" element={<Navigate to="/user/login" />} />
      </Routes>
    </div>
  );
};

export default UserMain;
