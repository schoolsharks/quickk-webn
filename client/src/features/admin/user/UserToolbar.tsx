import React from "react";
import GlobalToolbar from "../../../components/layout/GlobalToolbar";
import { useCreateBlankUserMutation } from "../service/adminApi";
import { useNavigate } from "react-router-dom";

interface UserToolbarProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
}

const UserToolbar: React.FC<UserToolbarProps> = ({
  onSearchChange,
  // searchValue,
}) => {
  const [CreateBlankUser] = useCreateBlankUserMutation();
  const navigate = useNavigate();

  const handleCreateUser = () => {
    CreateBlankUser({})
      .unwrap()
      .then((data) => {
        navigate(`/admin/user/${data}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <GlobalToolbar
      buttonTitle="Create New User"
      onButtonClick={handleCreateUser}
      onFilterClick={() => {}} // Empty function since no filters
      onSearchChange={onSearchChange}
      placeholder = {"name, company mail, contact"}
    />
  );
};

export default UserToolbar;
