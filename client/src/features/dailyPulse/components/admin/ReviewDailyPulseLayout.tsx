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
import Advertisement from "../../../question/components/Advertisement";
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
import { useSelector } from "react-redux";
import { Roles } from "../../../auth/authSlice";
import { RootState } from "../../../../app/store";

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
  score: number;
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
  const [GetDailyPulseTable] = useLazyGetDailyPulseTableQuery();

  // Get user role from Redux store
  const userRole = useSelector((state: RootState) => state.auth.role);
  const isSuperAdmin = userRole === Roles.SUPER_ADMIN;

  // Button text changes based on role
  const publishButtonText = isSuperAdmin ? "Publish" : "Send for Review";

  const [publishOn, setPublishOn] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

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
      score: 0,
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
        score: 0,
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

                case "yes-no":
                  if (p.image != "") {
                    pulseType = "Mentor";
                  } else {
                    pulseType = "Yes / No";
                  }
                  break;
                case "agree-disagree":
                  pulseType = "Agree / Disagree";
                  break;
                case "text":
                  // Detect Advertisement when it's a single 'Interested' option
                  if (
                    (Array.isArray((p as any).options) &&
                      (p as any).options.length === 1 &&
                      (p as any).options[0]?.toLowerCase?.() ===
                        "interested") ||
                    (Array.isArray((p as any).questionOptions) &&
                      (p as any).questionOptions.length === 1 &&
                      (p as any).questionOptions[0]?.toLowerCase?.() ===
                        "interested") ||
                    (p as any).qType === "ADVERTISEMENT"
                  ) {
                    pulseType = "Advertisement";
                  } else {
                    pulseType = "Multiple Choice Question";
                  }

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
                qType:
                  pulseType === "Advertisement"
                    ? "ADVERTISEMENT"
                    : (p as any).qType || "",
              };
            }

            return {
              ...defaultPulseData,
              ...(p as Partial<PulseData>),
              type: p.type?.toLowerCase() || "question",
              pulseType,
              qType:
                pulseType === "Advertisement"
                  ? "ADVERTISEMENT"
                  : (p as any).qType || "",
              questionOptions: p.questionOptions,
              correctAnswer: p.correctAnswer || "",
            };
          })
        : [defaultPulseData];

      setPulses(normalizedPulses);
      setPublishOn(PulseData.publishOn ? new Date(PulseData.publishOn) : null);
      const totalStars =
        PulseData?.pulses?.reduce(
          (sum, pulse) => sum + (pulse.score ?? 0),
          0
        ) ?? 0;
      setStars(totalStars);
    }
  }, [PulseData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          pulse.questionText.trim() !== ""
          // pulse.optionA.trim() !== "" &&
          // pulse.optionB.trim() !== ""
        );
      } else if (pulse.pulseType === "Yes / No") {
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        pulse.optionType = "yes-no";
        pulse.options = ["YES", "NO"];
        return pulse.questionText.trim() !== "";
      } else if (pulse.pulseType === "Agree / Disagree") {
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        pulse.optionType = "agree-disagree";
        pulse.options = ["AGREE", "DISAGREE"];
        return pulse.questionText.trim() !== "";
      } else if (pulse.pulseType === "Image (Right / Wrong)") {
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        return pulse.questionText.trim() !== "";
      } else if (pulse.pulseType === "Mentor") {
        pulse.qType = "TWO_CHOICE";
        pulse.optionType = "yes-no";
        pulse.options = ["YES", "NO"];
        pulse.type = "question";
        return pulse.questionText.trim() !== "";
      } else if (pulse.pulseType === "Multiple Images") {
        pulse.qType = "TWO_CHOICE";
        pulse.type = "question";
        return pulse.questionText.trim() !== "" && pulse.options.length >= 2;
      } else if (pulse.pulseType === "Advertisement") {
        // Enforce single Interested option and text optionType
        pulse.type = "question";
        pulse.qType = "ADVERTISEMENT";
        pulse.optionType = "text";
        pulse.options = ["Interested"];
        return (
          pulse.questionText.trim() !== "" &&
          (imageInputModes[currentPulseIndex] === "file"
            ? !!uploadedImages[currentPulseIndex]
            : (pulse.image || "").trim() !== "")
        );
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
      publishOn: publishOn
        ? new Date(
            Date.UTC(
              publishOn.getFullYear(),
              publishOn.getMonth(),
              publishOn.getDate()
            )
          ).toISOString()
        : "",
      stars: stars,
    };

    let formData: FormData | null = null;

    if (hasFiles) {
      formData = new FormData();
      formData.append("dailyPulseId", PulseData?._id || "");
      formData.append("status", action === "draft" ? "drafts" : "published");
      formData.append(
        "publishOn",
        publishOn
          ? new Date(
              Date.UTC(
                publishOn.getFullYear(),
                publishOn.getMonth(),
                publishOn.getDate()
              )
            ).toISOString()
          : ""
      );
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
        console.log("Submitting with files. FormData entries:", formData);
        await UpdateDailyPulse(formData).unwrap();
      } else {
        console.log("Submitting with files. newFormData entries:", newFormData);
        await UpdateDailyPulse(newFormData).unwrap();
      }
      setConfirmDialog({ open: false, action: "", title: "", message: "" });
      navigate("/admin/learnings/dailyPulse");
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
      .then((apiData) => {
        // Calculate disabled dates directly from API response
        const freshDisabledDates = apiData
          .filter((dailyPulse: any) => {
            return (
              dailyPulse.status === "published" &&
              !(dailyPulse._id === PulseData?._id)
            );
          })
          .map((dailyPulse: any) => {
            return formatDate(new Date(dailyPulse?.publishOn));
          });

        // Store the current disabled dates for use in date picker
        setDisabledDates(freshDisabledDates);

        // Check if a date is selected
        if (!publishOn) {
          // No date selected, show date picker
          setShowDatePicker(true);
          return;
        }

        // Check if the selected date conflicts with existing pulses
        const currentDateStr = formatDate(publishOn);
        const hasConflict = freshDisabledDates.includes(currentDateStr);

        if (hasConflict) {
          // Date conflicts, show date picker to select a different date
          setShowDatePicker(true);
        } else {
          // No conflict, proceed with confirmation
          const actionText = isSuperAdmin ? "publish" : "send for review";
          const titleText = isSuperAdmin
            ? "Publish Daily Pulse"
            : "Send for Review";
          setConfirmDialog({
            open: true,
            action: "publish",
            title: titleText,
            message: `Are you sure you want to ${actionText} this daily pulse with ${pulses.length} pulse(s) on ${currentDateStr}?`,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch daily pulse data:", error);
        alert("Failed to fetch existing daily pulse data. Please try again.");
      });
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
      // When switching to Advertisement, initialize specific fields
      ...(newType === "Advertisement"
        ? {
            qType: "ADVERTISEMENT",
            optionType: "text",
            options: ["Interested"],
          }
        : {}),
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
      score: 0,
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
          <Box sx={{ minHeight: "400px" }}>
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
          </Box>
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
          <Box sx={{ minHeight: "400px" }}>
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
                currentPulse.optionA && currentPulse.optionB
                  ? ["A", "B"]
                  : currentPulse.options
                  ? currentPulse.options
                  : []
              }
              correctAnswer={currentPulse.correctAnswer || ""}
              onAnswer={() => {}}
            />
          </Box>
        );

      case "Yes / No":
        return (
          <Box sx={{ minHeight: "400px" }}>
            <QuestionTwoOption
              id="preview"
              questionText={currentPulse.questionText || ""}
              optionType="text"
              options={["Yes", "No"]}
              correctAnswer={currentPulse.correctAnswer || ""}
              onAnswer={() => {}}
            />
          </Box>
        );

      case "Agree / Disagree":
        return (
          <Box sx={{ minHeight: "400px" }}>
            <QuestionTwoOption
              id="preview"
              questionText={currentPulse.questionText || ""}
              optionType="text"
              options={["Agree", "Disagree"]}
              correctAnswer={currentPulse.correctAnswer || ""}
              onAnswer={() => {}}
            />
          </Box>
        );

      case "Image (Right / Wrong)":
        return (
          <Box sx={{ minHeight: "400px" }}>
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
          </Box>
        );
      case "Mentor":
        return (
          <Box sx={{ minHeight: "400px" }}>
            <QuestionTwoOption
              id="preview"
              questionText={
                currentPulse.questionText || ""
                // defaultData.rightWrong.questionText
              }
              optionType="text"
              options={["Yes", "No"]}
              image={
                currentPulse.image || uploadedImages[currentPulseIndex] || ""
              }
              onAnswer={() => {}}
            />
          </Box>
        );

      case "Advertisement":
        return (
          <Box sx={{ minHeight: "400px" }}>
            <Advertisement
              id="preview"
              questionText={currentPulse.questionText || ""}
              image={
                currentPulse.image || uploadedImages[currentPulseIndex] || ""
              }
              optionType="text"
              response={undefined}
              // onAnswer={() => {}}
            />
          </Box>
        );

      default:
        return (
          <Box sx={{ minHeight: "400px" }}>
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
          </Box>
        );
    }
  };

  // Add UI for image input mode (URL/File) and file upload for image fields
  const renderFormFields = () => {
    switch (pulseType) {
      case "Flash Card":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Title
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": { color: "black" },
                "& .MuiInputBase-root": {
                  borderRadius: "0",
                },
              }}
            />
            <Typography variant="h6" color="black">
              Content
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={currentPulse.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": { color: "black" },
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
                  sx={{ color: "primary.main" }}
                />
              }
              label="Want Feedback?"
              sx={{ color: "black" }}
            />
          </Box>
        );

      case "Multiple Choice Question":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Typography variant="h6" color="black">
              Option A
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.optionA}
              onChange={(e) => handleInputChange("optionA", e.target.value)}
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Typography variant="h6" color="black">
              Option B
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.optionB}
              onChange={(e) => handleInputChange("optionB", e.target.value)}
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Typography variant="h6" color="black">
              Correct Answer
            </Typography>
            <RadioGroup
              value={currentPulse.correctAnswer}
              onChange={(e) =>
                handleInputChange("correctAnswer", e.target.value)
              }
            >
              <FormControlLabel
                value={currentPulse.optionA}
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">Option A</Typography>}
              />
              <FormControlLabel
                value={currentPulse.optionB}
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">Option B</Typography>}
              />
            </RadioGroup>
          </Box>
        );

      case "Yes / No":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <Typography variant="h6" color="black">
              Correct Answer
            </Typography>
            <RadioGroup
              value={currentPulse.correctAnswer}
              onChange={(e) =>
                handleInputChange("correctAnswer", e.target.value)
              }
            >
              <FormControlLabel
                value="YES"
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">Yes</Typography>}
              />
              <FormControlLabel
                value="NO"
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">No</Typography>}
              />
            </RadioGroup>
          </Box>
        );
      case "Agree / Disagree":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <Typography variant="h6" color="black">
              Correct Answer
            </Typography>
            <RadioGroup
              value={currentPulse.correctAnswer}
              onChange={(e) =>
                handleInputChange("correctAnswer", e.target.value)
              }
            >
              <FormControlLabel
                value="AGREE"
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">Agree</Typography>}
              />
              <FormControlLabel
                value="DISAGREE"
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">Disagree</Typography>}
              />
            </RadioGroup>
          </Box>
        );

      case "Image (Right / Wrong)":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Typography variant="h6" color="black">
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
                  borderColor: "primary.main",
                  background:
                    imageInputModes[currentPulseIndex] === "file"
                      ? "primary.main"
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
                  borderColor: "primary.main",
                  background:
                    imageInputModes[currentPulseIndex] === "url" ||
                    !imageInputModes[currentPulseIndex]
                      ? "primary.main"
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
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    color: "black",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
                placeholder="Paste image URL"
              />
            )}
          </Box>
        );
      case "Mentor":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Text
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <Typography variant="h6" color="black">
              Banner
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
                  borderColor: "primary.main",
                  background:
                    imageInputModes[currentPulseIndex] === "file"
                      ? "primary.main"
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
                  borderColor: "primary.main",
                  background:
                    imageInputModes[currentPulseIndex] === "url" ||
                    !imageInputModes[currentPulseIndex]
                      ? "primary.main"
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
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    color: "black",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
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
            <Typography variant="h6" color="black">
              Enter Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            {[0, 1].map((i) => (
              <Box key={i}>
                <Typography variant="h6" color="black">
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
                      borderColor: "primary.main",
                      background:
                        optionImageInputModes[currentPulseIndex]?.[i] === "file"
                          ? "primary.main"
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
                      borderColor: "primary.main",
                      background:
                        optionImageInputModes[currentPulseIndex]?.[i] ===
                          "url" ||
                        !optionImageInputModes[currentPulseIndex]?.[i]
                          ? "primary.main"
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
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-root": {
                        color: "black",
                        "& fieldset": { borderColor: "#444" },
                        "&:hover fieldset": { borderColor: "#666" },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                    placeholder="Paste image URL"
                  />
                )}
              </Box>
            ))}
          </Box>
        );
      case "Advertisement":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Company Name
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
              placeholder="Enter company name"
            />

            <Typography variant="h6" color="black">
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
                  borderColor: "primary.main",
                  background:
                    imageInputModes[currentPulseIndex] === "file"
                      ? "primary.main"
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
                  borderColor: "primary.main",
                  background:
                    imageInputModes[currentPulseIndex] === "url" ||
                    !imageInputModes[currentPulseIndex]
                      ? "primary.main"
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
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    color: "black",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
                placeholder="Paste image URL"
              />
            )}
          </Box>
        );
      default:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" color="black">
              Enter Question
            </Typography>
            <TextField
              fullWidth
              value={currentPulse.questionText ?? ""}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              sx={{
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <Typography variant="h6" color="black">
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
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />
            <Typography variant="h6" color="black">
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
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
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
              background: "#F0D7FF",
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
              <Typography variant="h6" color="black">
                Pulse {currentPulseIndex + 1} of {pulses.length}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={addNewPulse}
                  startIcon={<Add />}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: "0",
                    "&:hover": { backgroundColor: "primary.main" },
                    minWidth: "auto",
                    px: 2,
                  }}
                >
                  Add Pulse
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
              <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
                Choose the type of Pulse.
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={pulseType}
                  onChange={(e) => handlePulseTypeChange(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "0",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#666",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "black",
                    },
                    "& fieldset": { borderRadius: 0 },
                    "& .MuiOutlinedInput-root": {
                      color: "black",
                      "& fieldset": { borderColor: "#444" },
                    },
                  }}
                >
                  <MenuItem value="Flash Card">Flash Card</MenuItem>
                  <MenuItem value="Multiple Choice Question">
                    Multiple Choice Question
                  </MenuItem>
                  <MenuItem value="Yes / No">Yes / No</MenuItem>
                  <MenuItem value="Agree / Disagree">Agree / Disagree</MenuItem>
                  <MenuItem value="Image (Right / Wrong)">
                    Image (Right / Wrong)
                  </MenuItem>
                  <MenuItem value="Mentor">Mentor</MenuItem>
                  <MenuItem value="Multiple Images">Multiple Images</MenuItem>
                  <MenuItem value="Advertisement">Advertisement</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Dynamic Form Fields */}
            {renderFormFields()}
            {/* Publish Date */}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
                Stars-(For all Daily Pulse)
              </Typography>
              <TextField
                type="string"
                fullWidth
                value={stars}
                onChange={(e) => setStars(Number(e.target.value))}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    color: "black",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
              />

              <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
                Publish on
              </Typography>
              <DatePicker
                value={publishOn || null}
                onChange={(date) =>
                  setPublishOn(date ? new Date(date.valueOf()) : null)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      backgroundColor: "white",
                      color: "black",
                      "& .MuiPickersInputBase-root": {
                        borderRadius: "0",
                      },
                      "& .MuiInputBase-root": {
                        color: "black",
                      },
                      "& .MuiInputLabel-root": {
                        color: "black",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                      "& .MuiPickersSectionList-section ": {
                        color: "black",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "black",
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
              background: "#F0D7FF",
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
                  color: "black",
                  borderColor: "#444",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.main",
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">Publish On</Typography>
                  <Button
                    onClick={() => setShowDatePicker(false)}
                    sx={{
                      color: "#888",
                      minWidth: "auto",
                      px: 1,
                      "&:hover": { color: "white" },
                    }}
                  >
                    ✕
                  </Button>
                </Box>

                <DatePicker
                  value={publishOn || null}
                  onChange={(date) => {
                    if (date) {
                      const selectedDate = new Date(date.valueOf());
                      const selectedDateStr = formatDate(selectedDate);

                      // Check if the selected date is disabled using current disabled dates
                      if (disabledDates.includes(selectedDateStr)) {
                        alert(
                          "This date already has a published daily pulse. Please select a different date."
                        );
                        return;
                      }

                      // Valid date selected, update state, close picker, and show confirmation
                      setPublishOn(selectedDate);
                      setShowDatePicker(false);
                      setConfirmDialog({
                        open: true,
                        action: "publish",
                        title: "Publish Daily Pulse",
                        message: `Are you sure you want to publish this daily pulse with ${pulses.length} pulse(s) on ${selectedDateStr}?`,
                      });
                    }
                  }}
                  shouldDisableDate={(day) => {
                    const dateStr = formatDate(day as Date);
                    return disabledDates.includes(dateStr);
                  }}
                  sx={{
                    borderRadius: "0",
                    "& .MuiInputBase-root": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "& .MuiPickersSectionList-section ": {
                      color: "white",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: {
                        borderRadius: "0",
                        backgroundColor: "white",
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
              {publishButtonText}
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
                  confirmDialog.action === "publish" ? "primary.main" : "#666",
                color: confirmDialog.action === "publish" ? "black" : "white",
                "&:hover": {
                  backgroundColor:
                    confirmDialog.action === "publish"
                      ? "primary.main"
                      : "#555",
                },
              }}
            >
              {confirmDialog.action === "draft"
                ? "Save to Drafts"
                : publishButtonText}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Box>
  );
};

export default ReviewDailyPulseLayout;
