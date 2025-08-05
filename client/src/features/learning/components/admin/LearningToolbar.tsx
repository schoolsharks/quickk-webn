import React, { useState } from "react";
import GlobalToolbar from "../../../../components/layout/GlobalToolbar";
import { useNavigate } from "react-router-dom";
import { useLazyCreateBlankLearningQuery } from "../../service/learningApi";
import { Alert, Snackbar } from "@mui/material";

interface LearningToolbarProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
}

const LearningToolbar: React.FC<LearningToolbarProps> = ({
  onSearchChange,
}) => {
  const [CreateBlankLearning] = useLazyCreateBlankLearningQuery();
  const [openError, setOpenError] = useState(false);
  const navigate = useNavigate();

  const handleCreateNewModule = () => {
    CreateBlankLearning({})
      .unwrap()
      .then((data) => {
        const id = data?.data?.id;
        if (id) {
          navigate(`/admin/learnings/create/${id}`);
        }
      })
      .catch((error) => {
        console.log(error);
        setOpenError(true);
      });
  };

  return (
    <>
      <GlobalToolbar
        buttonTitle="Create New Module"
        onButtonClick={handleCreateNewModule}
        onFilterClick={() => {}}
        onSearchChange={onSearchChange}
        placeholder="name, status"
      />
      <Snackbar
        open={openError}
        autoHideDuration={4000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to create a new Module.
        </Alert>
      </Snackbar>
    </>
  );
};

export default LearningToolbar;
