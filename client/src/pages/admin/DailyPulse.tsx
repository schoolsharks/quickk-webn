import React from "react";
import DailyPulseLayout from "../../features/dailyPulse/components/admin/DailyPulseLayoutAdmin";
import { useGetDailyPulseStatsQuery } from "../../features/dailyPulse/dailyPulseApi";
import Loader from "../../components/ui/Loader";
import ErrorLayout from "../../components/ui/Error";

const DailyPulse: React.FC = () => {
  const {
    data: DailyPulseStatsData,
    isError: StatsError,
    isLoading: StatsLoading,
  } = useGetDailyPulseStatsQuery({}, { refetchOnMountOrArgChange: true });

  if (StatsLoading) {
    return <Loader />;
  }

  if (StatsError) {
    return <ErrorLayout />;
  }

  return <DailyPulseLayout DailyPulseStatsProps={DailyPulseStatsData?.data} />;
};

export default DailyPulse;
