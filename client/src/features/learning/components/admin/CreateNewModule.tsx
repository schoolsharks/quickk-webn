import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import AddAssessment, { CompleteQuestionData } from "./AddAssessment";
import Content from "./Content";
import GreenButton from "../../../../components/ui/GreenButton";
import { useUpdateModuleMutation } from "../../service/learningApi";
import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "Content", key: "content" },
  { label: "Assessment", key: "assessment" },
];

interface Module {
  _id?: string;
  title?: string;
  type?: string;
  duration?: number;
  content?: any[];
  assessment?: any[];
}

interface CreateNewModuleProps {
  module?: Module; // module prop is optional
}

const CreateNewModule: React.FC<CreateNewModuleProps> = ({ module }) => {
  const navigate = useNavigate();
  const [UpdateModule] = useUpdateModuleMutation();

  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const [title, setTitle] = useState(module?.title || "");
  const [type, setType] = useState(module?.type || "question");
  const [duration, setDuration] = useState<number | 0>(module?.duration ?? 0);
  const [contentData, setContentData] = useState<any[]>([]);
  const [assessmentData, setAssessmentData] = useState<CompleteQuestionData[]>(
    []
  );

  const mapContentData = (contentData: any) => {
    if (!Array.isArray(contentData)) return [];
    return contentData.map((con: any) => ({
      _id: con._id || "",
      subHeading: con.questionSubHeading || "",
      heading: con.questionSubText || "",
      content: con.questionText || "",
      explanation: con.explanation || "",
      correctAnswer: con.correctAnswer || "",
    }));
  };
  const mapAssessmentData = (assessmentData: any): CompleteQuestionData[] => {
    if (!Array.isArray(assessmentData)) return [];
    return assessmentData.map((assess: any) => ({
      ...assess,
      type: assess.qType,
    }));
  };

  useEffect(() => {
    if (module) {
      setTitle(module?.title || "");
      setType(module?.type || "question");
      setDuration(module?.duration ?? 0);
      setContentData(mapContentData(module?.content) || [{}]);
      setAssessmentData(mapAssessmentData(module?.assessment) || []);
    }
  }, [module]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  const checkData = () => {
    if (assessmentData.length === 0) {
      setActiveTab("assessment");
      setSnack({
        open: true,
        message: "Please fill the Assessment before publishing.",
        severity: "error",
      });
      return false;
    }
    if (contentData.length === 0) {
      setActiveTab("content");
      setSnack({
        open: true,
        message: "Please fill the Content before publishing.",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleCreateModule = async () => {
    const isValid = checkData();

    if (!isValid) {
      return; // Stop execution if any tab is empty
    }

    const submitData = new FormData();
    const moduleId = module?._id || "";

    submitData.append("moduleId", moduleId);
    submitData.append("title", title);
    submitData.append("type", type);
    submitData.append("duration", duration.toString());
    submitData.append("content", JSON.stringify(contentData));
    submitData.append("assessment", JSON.stringify(assessmentData));

    assessmentData.forEach((question, index) => {
      const image = (question as any).image;
      if (image && image instanceof File) {
        submitData.append(`question_${index}_image`, image);
      }
    });

    try {
      await UpdateModule(submitData).unwrap();
      navigate("/admin/learning/modules");
    } catch (error) {
      console.error("Module update failed:", error);
    }
  };

  return (
    <Box p={"24px"} display={"flex"} flexDirection={"column"} gap="20px">
      <Box sx={{ backgroundColor: "black", color: "white", p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Module Details
        </Typography>
        <Grid container spacing={2} mb={4} flexDirection="column">
          <Typography variant="h6">Title</Typography>
          <Grid size={6}>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

        <Grid container spacing={2} mb={4}>
          <Grid size={6}>
            <Typography variant="h6" gutterBottom>
              Module Type
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  borderRadius: "0",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0",
                    color: "white",
                    "& fieldset": { borderColor: "#444", borderRadius: "0" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                  },
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiSelect-icon": { color: "white" },
                  "& .MuiInputBase-root": {
                    borderRadius: "0",
                  },
                }}
              >
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="question">Question</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" gutterBottom>
              Duration in Minutes
            </Typography>
            <TextField
              fullWidth
              value={duration ?? ""}
              onChange={(e) => setDuration(Number(e.target.value))}
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
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleChange}>
          {tabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} value={tab.key} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ p: 4, background: "black" }}>
        {activeTab === "content" ? (
          <Content type={type} data={contentData} setData={setContentData} />
        ) : (
          <AddAssessment data={assessmentData} setData={setAssessmentData} />
        )}
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <GreenButton onClick={handleCreateModule}>
          {module?._id ? "Update Module" : "Create Module"}
        </GreenButton>
      </Box>
    </Box>
  );
};

export default CreateNewModule;
