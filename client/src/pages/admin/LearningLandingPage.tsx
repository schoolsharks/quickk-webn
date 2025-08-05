import React from "react";
import LearningLandingLayout from "../../features/learning/components/admin/LearningLandingLayout";
import {
  useGetLearningStatsQuery,
  useGetLearningTableDataQuery,
} from "../../features/learning/service/learningApi";
import ErrorLayout from "../../components/ui/Error";
import Loader from "../../components/ui/Loader";

const LearningLandingPage: React.FC = () => {
  const {
    data: learningTableData,
    isError,
    isLoading: LearningTableLoading,
  } = useGetLearningTableDataQuery({}, { 
    refetchOnMountOrArgChange: true,
    skip: false // This will be controlled by LearningLandingLayout
  });

  const {
    data: learningStatsData,
    isLoading: learningStatsLoading,
    isError: learningStatsError,
  } = useGetLearningStatsQuery({}, { refetchOnMountOrArgChange: true });

  if (LearningTableLoading && learningStatsLoading) {
    return <Loader />;
  }

  if (isError && learningStatsError) {
    return <ErrorLayout />;
  }

  return (
    <LearningLandingLayout
      LearningTableProps={{
        data: learningTableData?.data || [],
        isLoading: LearningTableLoading,
      }}
      LearningStatsProps={learningStatsData?.data}
    />
  );
};

export default LearningLandingPage;