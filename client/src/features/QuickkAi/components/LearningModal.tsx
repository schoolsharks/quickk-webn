import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import GreenButton from "../../../components/ui/GreenButton";
import { Stack, Typography, Divider } from "@mui/material";
import {
  useGetLearningTitlesQuery,
  useLazyCreateBlankLearningQuery,
  useLazyGetLearningByIdQuery,
  useUpdateLearningWithModulesMutation,
} from "../../learning/service/learningApi";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  //   borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

interface Learning {
  title: string;
  _id: string;
}

interface LearningModalProps {
  open: boolean;
  onClose: () => void;
  CreatedModuleId: string;
}

const LearningModal: React.FC<LearningModalProps> = ({
  open,
  onClose,
  CreatedModuleId,
}) => {
  const {
    data: LearningData,
    isError,
    isLoading,
  } = useGetLearningTitlesQuery({});

  const [CreateBlankLearning] = useLazyCreateBlankLearningQuery();
  const [UpdateLearningWithModules] = useUpdateLearningWithModulesMutation();
  const [GetLearningById] = useLazyGetLearningByIdQuery({});
  const navigate = useNavigate();

  const handleCreateNewLearning = () => {
    CreateBlankLearning({})
      .unwrap()
      .then((result) => {
        UpdateLearningWithModules({
          learningId: result?.data?.id,
          title: "Ai Generated Learning",
          moduleIds: [CreatedModuleId],
        })
          .unwrap()
          .then((learning) => {
            navigate(`/admin/learnings/create/${learning?.data?._id}`);
          })
          .catch((error) =>
            console.log("An error occured in Updating a new learning : ", error)
          );
      })
      .catch((error) =>
        console.log("An error occured in creating a new learning : ", error)
      );

    console.log("Create new learning clicked");
  };

  const handleLearningClick = (LearningId: string) => {
    GetLearningById( LearningId )
      .unwrap()
      .then((result) => {
        UpdateLearningWithModules({
          learningId: LearningId,
          title: result?.data.title,
          moduleIds: [
            ...result.data.modules.map((module: any) => module._id),
            CreatedModuleId,
          ],
        })
          .unwrap()
          .then((learning) => {
            navigate(`/admin/learnings/create/${learning?.data?._id}`);
          })
          .catch((error) =>
            console.log("An error occured in Updating a new learning : ", error)
          );
      })
      .catch((error) =>
        console.log("An error occured in creating a new learning : ", error)
      );
    console.log("Clicked learning:", LearningId);
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLayout />;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} display="flex" flexDirection="column" gap={3}>
        <Typography variant="h5" fontWeight={600} align="center">
          Choose a Learning
        </Typography>

        <Box display="flex" justifyContent="center">
          <GreenButton
            onClick={handleCreateNewLearning}
            startIcon={<AddIcon />}
          >
            Create New Learning
          </GreenButton>
        </Box>

        <Divider>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Typography variant="h5" fontWeight={500}>
          Select from existing learnings:
        </Typography>

        <Stack spacing={1} maxHeight="40vh" overflow="auto">
          {LearningData?.data.map((learning: Learning) => (
            <Box
              key={learning._id}
              onClick={() => handleLearningClick(learning._id)}
              sx={{
                cursor: "pointer",
                padding: "12px 16px",
                border: "2px solid #ddd",
                transition: "all 0.2s ease-in-out",
                background: "black",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {learning.title}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Modal>
  );
};

export default LearningModal;
