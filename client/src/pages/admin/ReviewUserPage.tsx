import React from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import ErrorLayout from "../../components/ui/Error";
import { useGetUserByIdQuery } from "../../features/admin/service/adminApi";
import ReviewUser from "../../features/admin/user/reviewUser";

const ReviewUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: user,
    isError,
    isLoading,
  } = useGetUserByIdQuery(userId, { refetchOnMountOrArgChange: true });
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorLayout />;
  }
  return <ReviewUser userData={user} />;
};

export default ReviewUserPage;
