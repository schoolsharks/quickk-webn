import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import InfoCard from "../../../question/components/InfoCard";
import QuestionTwoOption from "../../../question/components/QuestionTwoOption";
import GreenButton from "../../../../components/ui/GreenButton";
import {
  useLazyGetDailyPulseTableQuery,
  useUpdateDailyPulseMutation,
} from "../../dailyPulseApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import { CloudUpload } from "@mui/icons-material";

interface PulseData {
  type: string;
  optionType: string;
  qType: string;
  questionText: string;
  title: string;
  content: string;
  optionA: string;
  optionB: string;
  correctAnswer: string;
  image: string;
  questionOptions: string[];
  options: string[];
  wantFeedback: boolean;
  pulseType: string;
}

interface ReviewDailyPulseLayoutProps {
  PulseData?: {
    _id: string;
    pulses?: PulseData[];
    publishOn?: Date | string;
    stars?: number;
  };
}

const ReviewDailyPulseLayout: React.FC<ReviewDailyPulseLayoutProps> = ({
  PulseData,
}) => {
  const [UpdateDailyPulse] = useUpdateDailyPulseMutation();
  const navigate = useNavigate();
  const [GetDailyPulseTable, { data: DailyPulseDatesData }] =
    useLazyGetDailyPulseTableQuery();

  const [disabledDates, setDisabledDates] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (DailyPulseDatesData) {
      const dates = DailyPulseDatesData.filter((dailyPulse: any) => {
        return (
          dailyPulse.status === "published" &&
          !(dailyPulse._id === PulseData?._id)
        );
      }).map((dailyPulse: any) => {
        return formatDate(new Date(dailyPulse?.publishOn));
      });
      setDisabledDates(dates);
    }
  }, [DailyPulseDatesData]);

  // State for managing multiple pulses

  const [pulses, setPulses] = useState<PulseData[]>([
    {
      type: "infoCard",
      optionType: "text",
      qType: "",
      questionText: "",
      title: "",
      content: "",
      optionA: "",
      optionB: "",
      questionOptions: [],
      correctAnswer: "",
      image: "",
      options: [],
      wantFeedback: true,
      pulseType: "Flash Card",
    },
  ]);

  useEffect(() => {
    if (PulseData) {
      const defaultPulseData: PulseData = {
        qType: "",
        optionType: "text",
        questionText: "",
        title: "",
        content: "",
        optionA: "",
        optionB: "",
        questionOptions: [],
        correctAnswer: "",
        image: "",
        options: [],
        wantFeedback: true,
        type: "infoCard",
        pulseType: "Flash Card",
      };

      const normalizedPulses: PulseData[] = PulseData.pulses?.length
        ? PulseData.pulses.map((p) => {
            const isInfoCard = p.type?.toLowerCase() === "infocard";

            // Determine pulseType dynamically
            let pulseType: PulseData["pulseType"] = "Multiple Choice Question";

            if (isInfoCard) {
              pulseType = "Flash Card";
            } else {
              switch (p.optionType) {
                case "correct-incorrect":
                  if (p.image) {
                    pulseType = "Image (Right / Wrong)";
                  } else {
                    pulseType = "Right Wrong";
                  }
                  break;
                case "image":
                  pulseType = "Multiple Images";
                  break;
                case "text":
                  pulseType = "Multiple Choice Question";

                  break;
                default:
                  pulseType = "Multiple Choice Question";
              }
            }

            if ("data" in p && typeof p.data === "object" && p.data !== null) {
              return {
                ...defaultPulseData,
                ...(p.data as Partial<PulseData>),
                type: p.type?.toLowerCase() || "question",
                pulseType,
              };
            }

            return {
              ...defaultPulseData,
              ...(p as Partial<PulseData>),
              type: p.type?.toLowerCase() || "question",
              pulseType,
              questionOptions: p.questionOptions,
            };
          })
        : [defaultPulseData];

      setPulses(normalizedPulses);
      setPublishOn(PulseData.publishOn ? new Date(PulseData.publishOn) : null);
      setStars(PulseData.stars ?? 0);
    }
  }, [PulseData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [publishOn, setPublishOn] = useState<Date | null>(null);
  const [stars, setStars] = useState<Number | 0>(0);

  const [currentPulseIndex, setCurrentPulseIndex] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    title: "",
    message: "",
  });

  // New: Track image input mode and uploaded files for each pulse
  const [imageInputModes, setImageInputModes] = useState<{
    [key: number]: "url" | "file";
  }>({});
  const [uploadedImages, setUploadedImages] = useState<{
    [key: number]: File | null;
  }>({});
  const [optionImageInputModes, setOptionImageInputModes] = useState<{
    [key: number]: ("url" | "file")[];
  }>({});
  const [uploadedOptionImages, setUploadedOptionImages] = useState<{
    [key: number]: (File | null)[];
  }>({});

  // Get current pulse data
  const currentPulse = pulses[currentPulseIndex];
  const pulseType = currentPulse.pulseType;

  const handleConfirmAction = async (action: "draft" | "publish") => {
    const validPulses = pulses.filter((pulse) => {
      // Check if pulse has required data based on type
      if (pulse.pulseType === "Flash Card") {
        pulse.type = "infoCard";
        return pulse.title.trim() !== "" || pulse.content.trim() !== "";
      } else if (pulse.pulseType === "Multiple Choice Question") {
        pulse.options = [pulse.optionA, pulse.optionB];
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        return (
          pulse.questionText.trim() !== "" &&
          pulse.optionA.trim() !== "" &&
          pulse.optionB.trim() !== ""
        );
      } else if (pulse.pulseType === "Image (Right / Wrong)") {
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        return pulse.questionText.trim() !== "";
      } else if (pulse.pulseType === "Multiple Images") {
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        return pulse.questionText.trim() !== "" && pulse.options.length >= 2;
      }
      return false;
    });

    if (validPulses.length === 0) {
      alert(
        "Please fill at least one pulse with required data before proceeding."
      );
      return;
    }

    const formattedPulses = validPulses.map((pulse, idx) => {
      // For file uploads, remove image fields from data, backend will attach URLs
      let data = { ...pulse };
      if (imageInputModes[idx] === "file") {
        data.image = "";
      }
      if (optionImageInputModes[idx]) {
        data.options = data.options.map((opt: string, i: number) =>
          optionImageInputModes[idx][i] === "file" ? "" : opt
        );
      }
      return {
        type: data.type,
        data,
      };
    });

    // Check if any files are uploaded
    const hasFiles =
      Object.values(uploadedImages).some(Boolean) ||
      Object.values(uploadedOptionImages).some(
        (arr) => arr && arr.some(Boolean)
      );

    let newFormData: any = {
      dailyPulseId: PulseData?._id,
      pulses: formattedPulses,
      status: action === "draft" ? "drafts" : "published",
      publishOn: publishOn,
      stars: stars,
    };

    let formData: FormData | null = null;

    if (hasFiles) {
      formData = new FormData();
      formData.append("dailyPulseId", PulseData?._id || "");
      formData.append("status", action === "draft" ? "drafts" : "published");
      formData.append("publishOn", publishOn ? publishOn.toISOString() : "");
      formData.append("stars", String(stars));
      formData.append("pulses", JSON.stringify(formattedPulses));

      // Attach images with specific field names for mapping
      Object.entries(uploadedImages).forEach(([pulseIndex, file]) => {
        if (file) formData?.append(`pulse_${pulseIndex}_image`, file);
      });

      Object.entries(uploadedOptionImages).forEach(([pulseIndex, arr]) => {
        arr &&
          arr.forEach((file, optionIndex) => {
            if (file)
              formData?.append(
                `pulse_${pulseIndex}_option_${optionIndex}`,
                file
              );
          });
      });
    }

    try {
      if (formData) {
        await UpdateDailyPulse(formData).unwrap();
      } else {
        await UpdateDailyPulse(newFormData).unwrap();
      }
      setConfirmDialog({ open: false, action: "", title: "", message: "" });
      navigate("/admin/learnings/dailyInteraction");
    } catch (error) {
      console.error(`Failed to ${action} DailyPulse:`, error);
    }
  };

  const handleDraftClick = () => {
    setConfirmDialog({
      open: true,
      action: "draft",
      title: "Save to Drafts",
      message: `Are you sure you want to save this daily pulse with ${pulses.length} pulse(s) to drafts?`,
    });
  };

  const handlePublishClick = () => {
    GetDailyPulseTable({})
      .unwrap()
      .then(() => {
        setShowDatePicker(true);
      });

    // setConfirmDialog({
    //   open: true,
    //   action: "publish",
    //   title: "Publish Daily Pulse",
    //   message: `Are you sure you want to publish this daily pulse with ${pulses.length} pulse(s)?`,
    // });
  };

  const handleInputChange = (field: keyof PulseData, value: any) => {
    const updatedPulses = [...pulses];
    updatedPulses[currentPulseIndex] = {
      ...updatedPulses[currentPulseIndex],
      [field]: value,
    };
    setPulses(updatedPulses);
  };

  const handlePulseTypeChange = (newType: string) => {
    const updatedPulses = [...pulses];
    let dailyPulseType = "infoCard";

    if (newType !== "Flash Card") {
      dailyPulseType = "question";
    }

    updatedPulses[currentPulseIndex] = {
      ...updatedPulses[currentPulseIndex],
      pulseType: newType,
      type: dailyPulseType,
    };
    setPulses(updatedPulses);
  };

  const addNewPulse = () => {
    const newPulse: PulseData = {
      type: "infoCard",
      optionType: "text",
      qType: "",
      questionText: "",
      title: "",
      content: "",
      optionA: "",
      optionB: "",
      questionOptions: [],
      correctAnswer: "",
      image: "",
      options: [],
      wantFeedback: true,
      pulseType: "Flash Card",
    };
    setPulses([...pulses, newPulse]);
    setCurrentPulseIndex(pulses.length);
  };

  const deletePulse = (index: number) => {
    if (pulses.length > 1) {
      const updatedPulses = pulses.filter((_, i) => i !== index);
      setPulses(updatedPulses);
      if (currentPulseIndex >= updatedPulses.length) {
        setCurrentPulseIndex(updatedPulses.length - 1);
      }
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Months start from 0
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPulseIndex(value - 1);
  };

  const getPreviewComponent = () => {
    switch (pulseType) {
      case "Flash Card":
        return (
          <InfoCard
            id="preview"
            title={
              currentPulse.title || ""
              // defaultData.flashCard.title
            }
            content={currentPulse.content || ""}
            wantFeedback={currentPulse.wantFeedback}
            onClickFeedback={() => {}}
          />
        );

      case "Multiple Choice Question":
        if (
          Array.isArray(currentPulse.questionOptions) &&
          currentPulse.questionOptions.length > 0
        ) {
          currentPulse.optionA = currentPulse.questionOptions[0];
          currentPulse.optionB = currentPulse.questionOptions[1];
        }
        return (
          <QuestionTwoOption
            id="preview"
            questionText={currentPulse.questionText || ""}
            questionOptions={
              currentPulse.optionA && currentPulse.optionB
                ? [`${currentPulse.optionA}`, `${currentPulse.optionB}`]
                : []
              // currentPulse.options || []
            }
            optionType="text"
            options={
              currentPulse.optionA && currentPulse.optionB ? ["A", "B"] : []
            }
            correctAnswer={currentPulse.correctAnswer || ""}
            onAnswer={() => {}}
          />
        );

      case "Image (Right / Wrong)":
        return (
          <QuestionTwoOption
            id="preview"
            questionText={
              currentPulse.questionText || ""
              // defaultData.rightWrong.questionText
            }
            optionType="correct-incorrect"
            options={["right", "wrong"]}
            image={
              currentPulse.image || uploadedImages[currentPulseIndex] || ""
            }
            onAnswer={() => {}}
          />
        );

      default:
        return (
          <QuestionTwoOption
            id="preview"
            questionText={
              currentPulse.questionText || ""
              // defaultData.multipleImages.questionText
            }
            optionType="image"
            options={
              uploadedOptionImages[currentPulseIndex]?.some(Boolean)
                ? [0, 1]
                    .map(
                      (i) =>
                        uploadedOptionImages[currentPulseIndex]?.[i] || null
                    )
                    .filter((f): f is File => !!f)
                : [0, 1].map((i) => currentPulse.options[i] || "")
            }
            onAnswer={() => {}}
          />
        );
    }
  };

  // Add UI for image input mode (URL/File) and file upload for image fields
  const renderFormFields = () => {
    switch (pulseType) {
      case "Flash Card":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="white">
              Title
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-root": {
                  borderRadius: "0",
                },
              }}
            />
            <Typography variant="h6" color="white">
              Content
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={currentPulse.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-root": {
                  borderRadius: "0",
                },
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={currentPulse.wantFeedback}
                  onChange={(e) =>
                    handleInputChange("wantFeedback", e.target.checked)
                  }
                  color="success"
                />
              }
              label="Want Feedback?"
              sx={{ color: "white" }}
            />
          </Box>
        );

      case "Multiple Choice Question":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="white">
              Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />

            <Typography variant="h6" color="white">
              Option A
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.optionA}
              onChange={(e) => handleInputChange("optionA", e.target.value)}
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />

            <Typography variant="h6" color="white">
              Option B
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.optionB}
              onChange={(e) => handleInputChange("optionB", e.target.value)}
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />

            <Typography variant="h6" color="white">
              Correct Answer
            </Typography>
            <RadioGroup
              value={currentPulse.correctAnswer}
              onChange={(e) =>
                handleInputChange("correctAnswer", e.target.value)
              }
            >
              <FormControlLabel
                value="A"
                control={<Radio sx={{ color: "white" }} />}
                label={<Typography color="white">Option A</Typography>}
              />
              <FormControlLabel
                value="B"
                control={<Radio sx={{ color: "white" }} />}
                label={<Typography color="white">Option B</Typography>}
              />
            </RadioGroup>
          </Box>
        );

      case "Image (Right / Wrong)":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="white">
              Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />

            <Typography variant="h6" color="white">
              Image
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                startIcon={<CloudUpload />}
                variant={
                  imageInputModes[currentPulseIndex] === "file"
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  setImageInputModes((m) => ({
                    ...m,
                    [currentPulseIndex]: "file",
                  }))
                }
                sx={{
                  color:
                    imageInputModes[currentPulseIndex] === "file"
                      ? "black"
                      : "white",
                  borderColor: "#96FF43",
                  background:
                    imageInputModes[currentPulseIndex] === "file"
                      ? "#96FF43"
                      : "transparent",
                  minWidth: 0,
                }}
              >
                File
              </Button>
              <Button
                variant={
                  imageInputModes[currentPulseIndex] === "url" ||
                  !imageInputModes[currentPulseIndex]
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  setImageInputModes((m) => ({
                    ...m,
                    [currentPulseIndex]: "url",
                  }))
                }
                sx={{
                  color:
                    imageInputModes[currentPulseIndex] === "url"
                      ? "black"
                      : "white",
                  borderColor: "#96FF43",
                  background:
                    imageInputModes[currentPulseIndex] === "url" ||
                    !imageInputModes[currentPulseIndex]
                      ? "#96FF43"
                      : "transparent",
                  minWidth: 0,
                }}
              >
                URL
              </Button>
            </Box>
            {imageInputModes[currentPulseIndex] === "file" ? (
              <input
                type="file"
                // value={currentPulse?.image || " "}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadedImages((imgs) => ({
                    ...imgs,
                    [currentPulseIndex]: file,
                  }));
                  handleInputChange("image", "");
                }}
              />
            ) : (
              <TextField
                fullWidth
                value={currentPulse.image ?? ""}
                onChange={(e) => {
                  handleInputChange("image", e.target.value);
                  setUploadedImages((imgs) => ({
                    ...imgs,
                    [currentPulseIndex]: null,
                  }));
                }}
                sx={{
                  backgroundColor: "#333",
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                  },
                }}
                placeholder="Paste image URL"
              />
            )}
          </Box>
        );

      case "Multiple Images":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="white">
              Enter Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />
            {[0, 1].map((i) => (
              <Box key={i}>
                <Typography variant="h6" color="white">
                  Option {i === 0 ? "A" : "B"} (Image)
                </Typography>
                <Box
                  mt={1}
                  mb={1}
                  sx={{ display: "flex", gap: 2, alignItems: "center" }}
                >
                  <Button
                    startIcon={<CloudUpload />}
                    variant={
                      optionImageInputModes[currentPulseIndex]?.[i] === "file"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      setOptionImageInputModes((m) => ({
                        ...m,
                        [currentPulseIndex]: [
                          ...(m[currentPulseIndex] || ["url", "url"]).map(
                            (mode, idx) => (idx === i ? "file" : mode)
                          ),
                        ],
                      }))
                    }
                    sx={{
                      color:
                        optionImageInputModes[currentPulseIndex]?.[i] === "file"
                          ? "black"
                          : "white",
                      borderColor: "#96FF43",
                      background:
                        optionImageInputModes[currentPulseIndex]?.[i] === "file"
                          ? "#96FF43"
                          : "transparent",
                      minWidth: 0,
                    }}
                  >
                    File
                  </Button>
                  <Button
                    variant={
                      optionImageInputModes[currentPulseIndex]?.[i] === "url" ||
                      !optionImageInputModes[currentPulseIndex]?.[i]
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      setOptionImageInputModes((m) => ({
                        ...m,
                        [currentPulseIndex]: [
                          ...(m[currentPulseIndex] || ["url", "url"]).map(
                            (mode, idx) => (idx === i ? "url" : mode)
                          ),
                        ],
                      }))
                    }
                    sx={{
                      color:
                        optionImageInputModes[currentPulseIndex]?.[i] === "url"
                          ? "black"
                          : "white",
                      borderColor: "#96FF43",
                      background:
                        optionImageInputModes[currentPulseIndex]?.[i] ===
                          "url" ||
                        !optionImageInputModes[currentPulseIndex]?.[i]
                          ? "#96FF43"
                          : "transparent",
                      minWidth: 0,
                    }}
                  >
                    URL
                  </Button>
                </Box>
                {optionImageInputModes[currentPulseIndex]?.[i] === "file" ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadedOptionImages((imgs) => ({
                        ...imgs,
                        [currentPulseIndex]: [
                          ...(imgs[currentPulseIndex] || [null, null]).map(
                            (f, idx) => (idx === i ? file : f)
                          ),
                        ],
                      }));
                      // Clear URL field
                      const newOptions = [...(currentPulse.options || [])];
                      newOptions[i] = "";
                      handleInputChange("options", newOptions);
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    value={currentPulse.options[i] ?? ""}
                    onChange={(e) => {
                      const newOptions = [...(currentPulse.options || [])];
                      newOptions[i] = e.target.value;
                      handleInputChange("options", newOptions);
                      setUploadedOptionImages((imgs) => ({
                        ...imgs,
                        [currentPulseIndex]: [
                          ...(imgs[currentPulseIndex] || [null, null]).map(
                            (f, idx) => (idx === i ? null : f)
                          ),
                        ],
                      }));
                    }}
                    sx={{
                      backgroundColor: "#333",
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "#444" },
                        "&:hover fieldset": { borderColor: "#666" },
                        "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                      },
                    }}
                    placeholder="Paste image URL"
                  />
                )}
              </Box>
            ))}
          </Box>
        );
      default:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="white">
              Enter Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />
            <Typography variant="h6" color="white">
              Option A (Image URL)
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.options[0] ?? ""}
              onChange={(e) => {
                const newOptions = [...currentPulse.options];
                newOptions[0] = e.target.value;
                handleInputChange("options", newOptions);
              }}
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />
            <Typography variant="h6" color="white">
              Option B (Image URL)
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.options[1] ?? ""}
              onChange={(e) => {
                const newOptions = [...currentPulse.options];
                newOptions[1] = e.target.value;
                handleInputChange("options", newOptions);
              }}
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                },
              }}
            />
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        p: "24px",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display={"flex"} flexDirection={"row"}>
          {/* Left Panel */}
          <Box
            sx={{
              width: "40%",
              background: "black",
              p: 4,
            }}
          >
            {/* Pulse Counter and Add Button */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="white">
                Interaction {currentPulseIndex + 1} of {pulses.length}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={addNewPulse}
                  startIcon={<Add />}
                  sx={{
                    backgroundColor: "#96FF43",
                    color: "black",
                    borderRadius: "0",
                    "&:hover": { backgroundColor: "#7BD932" },
                    minWidth: "auto",
                    px: 2,
                  }}
                >
                  Add Interaction
                </Button>
                {pulses.length > 1 && (
                  <IconButton
                    onClick={() => deletePulse(currentPulseIndex)}
                    sx={{
                      background: "white",
                      color: "black",
                      borderRadius: 0,
                      "&:hover": { background: "white" },
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Pulse Type Selector */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Choose the type of Interaction.
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={pulseType}
                  onChange={(e) => handlePulseTypeChange(e.target.value)}
                  sx={{
                    backgroundColor: "#333",
                    color: "white",
                    borderRadius: "0",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#666",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#96FF43",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& fieldset": { borderRadius: 0 },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#444" },
                    },
                  }}
                >
                  <MenuItem value="Flash Card">Flash Card</MenuItem>
                  <MenuItem value="Multiple Choice Question">
                    Multiple Choice Question
                  </MenuItem>
                  <MenuItem value="Image (Right / Wrong)">
                    Image (Right / Wrong)
                  </MenuItem>
                  <MenuItem value="Multiple Images">Multiple Images</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Dynamic Form Fields */}
            {renderFormFields()}
            {/* Publish Date */}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Stars-(For all Daily Interaction)
              </Typography>
              <TextField
                type="string"
                fullWidth
                value={stars}
                onChange={(e) => setStars(Number(e.target.value))}
                sx={{
                  mb: 2,
                  backgroundColor: "#333",
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "#96FF43" },
                  },
                }}
              />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Publish on
              </Typography>
              <DatePicker
                value={publishOn || null}
                onChange={(date) => setPublishOn(date)}
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
            </Box>
          </Box>

          {/* Right Panel - Preview */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              flexDirection: "column",
              background: "black",
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: "700px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
                px: "150px",
                minWidth: "350px",
              }}
            >
              {getPreviewComponent()}
            </Box>
          </Box>
        </Box>

        {/* Pagination */}
        {pulses.length > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
            <Pagination
              count={pulses.length}
              page={currentPulseIndex + 1}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",
                  borderColor: "#444",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#96FF43",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#7BD932",
                    },
                  },
                },
                "& .MuiButtonBase-root": {
                  borderRadius: 0,
                },
              }}
            />
          </Box>
        )}

        {/* Bottom Buttons */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
          }}
        >

          <GreenButton onClick={handleDraftClick}>Save To Drafts</GreenButton>

          <GreenButton
            onClick={handlePublishClick}
            sx={{ background: "black", color: "white", minWidth: "150px" }}
          >
            Publish
          </GreenButton>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
          }}
        >
          <GreenButton onClick={handleDraftClick}>Save To Drafts</GreenButton>

          {/* Container for Publish Button + DatePicker */}
          <Box sx={{ position: "relative" }}>
            {/* Floating DatePicker */}
            {showDatePicker && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "100%", // Places it above the button
                  right: 0,
                  mb: 1, // Margin below DatePicker
                  zIndex: 10,
                  background: "#1e1e1e",
                  p: 2,
                  borderRadius: 0,
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Publish On
                </Typography>

                <DatePicker
                  value={publishOn || null}
                  onChange={(date) => {
                    setPublishOn(date);
                    setConfirmDialog({
                      open: true,
                      action: "publish",
                      title: "Publish Daily Pulse",
                      message: `Are you sure you want to publish this daily pulse with ${pulses.length} pulse(s)?`,
                    });
                  }}
                  shouldDisableDate={(day) => {
                    const dateStr = formatDate(day as Date);
                    return disabledDates.includes(dateStr);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: {
                        backgroundColor: "#1e1e1e",
                        color: "white",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0px",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}

            {/* Publish Button */}
            <GreenButton
              onClick={handlePublishClick}
              sx={{ background: "black", color: "white", minWidth: "150px" }}
            >
              Publish
            </GreenButton>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() =>
            setConfirmDialog({
              open: false,
              action: "",
              title: "",
              message: "",
            })
          }
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "#222",
              color: "white",
            },
          }}
        >
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmDialog({
                  open: false,
                  action: "",
                  title: "",
                  message: "",
                });
                setShowDatePicker(false);
              }}
              sx={{ color: "#888" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleConfirmAction(confirmDialog.action as "draft" | "publish")
              }
              sx={{
                backgroundColor:
                  confirmDialog.action === "publish" ? "#96FF43" : "#666",
                color: confirmDialog.action === "publish" ? "black" : "white",
                "&:hover": {
                  backgroundColor:
                    confirmDialog.action === "publish" ? "#7BD932" : "#555",
                },
              }}
            >
              {confirmDialog.action === "draft" ? "Save to Drafts" : "Publish"}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Box>
  );
};

export default ReviewDailyPulseLayout;
