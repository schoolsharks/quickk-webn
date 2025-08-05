import React from "react";
import CreateLearning from "../../features/learning/components/admin/CreateLearning";
import { useGetLearningByIdQuery } from "../../features/learning/service/learningApi";
import { useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import ErrorLayout from "../../components/ui/Error";

const CreateLearningPage: React.FC = () => {
  const { learningId } = useParams<{ learningId: string }>();

  const {
    data: learning,
    isError,
    isLoading,
  } = useGetLearningByIdQuery(learningId, {
    skip: !learningId,
    refetchOnMountOrArgChange: true,
    // refetchOnFocus: true, 
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorLayout />;
  }
  return <CreateLearning Learning={learning?.data} />;
};

export default CreateLearningPage;
