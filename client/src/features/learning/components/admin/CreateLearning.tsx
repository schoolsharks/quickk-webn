import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GreenButton from "../../../../components/ui/GreenButton";
import { useNavigate } from "react-router-dom";
import {
  useUpdateLearningWithModulesMutation,
  useLazyPublishLearningQuery,
  useCreateBlankModuleMutation,
  useDeleteModuleByIdMutation,
} from "../../service/learningApi";

// ------------------- Types ----------------------
export interface Learning {
  _id?: string;
  title?: string;
  modules?: (
    | string
    | { _id: string; title: string; completionStatus: string }
  )[];
  validTill?: Date | string;
  publishOn?: Date | string;
}

interface LearningProps {
  Learning?: Learning;
}

interface Module {
  title: string;
  moduleId: string | number;
  completionStatus?: string;
}

// ------------------- Component ----------------------
const CreateLearning: React.FC<LearningProps> = ({ Learning }) => {
  const [UpdateLearningWithModules] = useUpdateLearningWithModulesMutation();
  const [CreateBlankModule] = useCreateBlankModuleMutation();
  const [DeleteModuleById] = useDeleteModuleByIdMutation();
  const [PublishLearning] = useLazyPublishLearningQuery();
  const navigate = useNavigate();

  const [openError, setOpenError] = useState(false);
  const [currentError, setCurrentError] = useState("");

  // ------------------- Controlled State Initialization ----------------------
  const [courseName, setCourseName] = useState(Learning?.title || "");
  const [validTill, setValidTill] = useState<Date | null>(
    Learning?.validTill ? new Date(Learning.validTill) : null
  );
  const [publishOn, setPublishOn] = useState<Date | null>(
    Learning?.publishOn ? new Date(Learning.publishOn) : null
  );

  const [modules, setModules] = useState<Module[]>(
    Learning?.modules?.map((mod, index) => {
      if (typeof mod === "string") {
        return { title: "", moduleId: mod }; // only id, title unknown
      } else {
        return {
          title: mod.title || "New Module",
          moduleId: mod._id || index,
          completionStatus: mod.completionStatus || "INCOMPLETE",
        };
      }
    }) || [
      {
        title: "New Module",
        moduleId: 0,
      },
    ]
  );

  useEffect(() => {
    if (Learning) {
      setCourseName(Learning.title || "");
      setValidTill(Learning.validTill ? new Date(Learning.validTill) : null);
      setPublishOn(Learning.publishOn ? new Date(Learning.publishOn) : null);
      setModules(
        Learning.modules?.map((mod, index) => {
          if (typeof mod === "string") {
            return { title: "", moduleId: mod };
          } else {
            return {
              title: mod.title || "New Module",
              moduleId: mod._id || index,
              completionStatus: mod.completionStatus || "INCOMPLETE",
            };
          }
        }) || [{ title: "New Module", moduleId: 0 }]
      );
    }
  }, [Learning]);

  // ------------------- Handlers ----------------------

  const handleDraft = () => {
    const payload = {
      learningId: Learning?._id,
      title: courseName,
      moduleIds: modules.map((m) => m.moduleId),
      validTill,
      publishOn,
    };
    UpdateLearningWithModules(payload)
      .unwrap()
      .then(() => navigate("/admin/learnings"))
      .catch((err) => {
        console.error("Failed to save draft:", err.data.message);
        setCurrentError(err.data.message);
        setOpenError(true);
      });
  };

  const handlePublish = () => {
    PublishLearning(Learning?._id)
      .unwrap()
      .then(() => navigate("/admin/learnings"))
      .catch((err) => {
        console.error("Failed to Publish learning:", err.data.message);
        setCurrentError(err.data.message);
        setOpenError(true);
      });
  };

  const addModule = async () => {
    try {
      const response = await CreateBlankModule({}).unwrap();
      setModules((prev) => [
        ...prev,
        { title: "New Module", moduleId: response.data },
      ]);
      let moduleIds = [...modules.map((m) => m.moduleId), response.data];
      const payload = {
        learningId: Learning?._id,
        title: courseName,
        moduleIds: moduleIds,
        validTill,
        publishOn,
      };
      UpdateLearningWithModules(payload);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (err: any) {
      console.error("Error creating blank module:", err);
      setCurrentError(err.data?.message || "Unknown error");
      setOpenError(true);
    }
  };

  const removeModule = (moduleId: string) => {
    DeleteModuleById(moduleId)
      .unwrap()
      .then(() => {
        setModules((prev) => prev.filter((mod) => mod.moduleId !== moduleId));
        let updatesModules = [
          ...modules.filter((mod) => mod.moduleId !== moduleId),
        ];
        const payload = {
          learningId: Learning?._id,
          title: courseName,
          moduleIds: updatesModules.map((m) => m.moduleId),
          validTill,
          publishOn,
        };
        // console.log(payload);
        UpdateLearningWithModules(payload);
        setCurrentError("Deleted successfully.");
        setOpenError(true);
      })
      .catch((err) => {
        console.error("Failed to delete Module:", err.data.message);
        setCurrentError(err.data.message);
        setOpenError(true);
      });
  };

  // ------------------- JSX ----------------------
  return (
    <Box display="flex" flexDirection="column" p="20px">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ backgroundColor: "black", color: "white", p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Course Details
          </Typography>
          <Grid container spacing={1} mb={4} flexDirection="column">
            <Typography variant="h6">Course Name</Typography>
            <Grid size={6}>
              <TextField
                fullWidth
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  "& .MuiInputBase-root": {
                    borderRadius: "0",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="h4" gutterBottom>
            Validity
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid size={6}>
              <Typography variant="h6" gutterBottom>
                Publish On
              </Typography>
              <DatePicker
                value={publishOn}
                onChange={(date) => setPublishOn(date ? new Date(date.valueOf()) : null)}
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      "& .MuiPickersInputBase-root": {
                        borderRadius: "0",
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography variant="h6" gutterBottom>
                Valid Till
              </Typography>
              <DatePicker
                value={validTill}
                onChange={(date) => setValidTill(date ? new Date(date.valueOf()) : null)}
                minDate={
                  publishOn
                    ? new Date(
                        new Date(publishOn).setHours(0, 0, 0, 0) +
                          24 * 60 * 60 * 1000
                      )
                    : new Date(
                        new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
                      )
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      "& .MuiPickersInputBase-root": {
                        borderRadius: "0",
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>

      {/* Module Section */}
      <Stack sx={{ background: "#464646", mt: "20px", p: "24px", gap: "8px" }}>
        <Box
          sx={{ background: "black" }}
          p="24px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Sub Modules</Typography>
          <IconButton
            onClick={addModule}
            sx={{
              background: "#96FF43",
              color: "black",
              borderRadius: "0px",
              p: "12px",
              "&:hover": { background: "#7be634" },
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </Box>

        {modules.map((module, idx) => (
          <Box
            key={typeof module.moduleId === "string" ? module.moduleId : idx}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={"4px"}
            bgcolor="black"
            p={2}
            sx={{
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 6, background: "#232323" },
            }}
          >
            <TextField
              value={module.title}
              onChange={(e) => {
                const updatedModules = modules.map((m, i) =>
                  i === idx ? { ...m, title: e.target.value } : m
                );
                setModules(updatedModules);
              }}
              placeholder="Module Title"
              variant="outlined"
              sx={{
                backgroundColor: "#232323",
                color: "white",
                borderRadius: 0,
                flex: 1,
                mr: 2,
                "& .MuiInputBase-root": {
                  borderRadius: "0",
                },
              }}
            />

            <IconButton
              onClick={() =>
                navigate(`/admin/learnings/create-module/${module.moduleId}`)
              }
              sx={{
                background: "white",
                color: "black",
                borderRadius: 0,
                mr: 1,
                "&:hover": { background: "white" },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => removeModule(module.moduleId.toString())}
              sx={{
                background: "white",
                color: "black",
                borderRadius: 0,
                "&:hover": { background: "white" },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>

      {/* Error Snackbar */}
      <Snackbar
        open={openError}
        autoHideDuration={4000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setOpenError(false);
          }}
          severity={"error"}
          sx={{ width: "100%" }}
        >
          {currentError}
        </Alert>
      </Snackbar>

      {/* Actions */}
      <Box gap="24px" display="flex" mt="24px" justifyContent="end">
        <GreenButton onClick={handleDraft}>Save to Drafts</GreenButton>
        <GreenButton onClick={handlePublish}>Publish</GreenButton>
      </Box>
    </Box>
  );
};

export default CreateLearning;
