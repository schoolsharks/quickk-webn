import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import FormBuilder, {
  FieldConfig,
} from "../../../../components/ui/FromBuilder";
import Preview from "../../../../components/ui/Preview";
import Pagination from "@mui/material/Pagination";

// Question types based on the image
export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TWO_CHOICE"
  | "DRAG_ORDER"
  | "MEMORY_MATCH";

interface MemoryPair {
  matchId: string;
  item1: {
    id?: string;
    content: string;
    type: "text" | "image";
  };
  item2: {
    id?: string;
    content: string;
    type: "text" | "image";
  };
}

export interface QuestionData {
  _id: string;
  type: QuestionType;
  questionText: string;
  questionSubHeading?: string;
  image?: string | File | null;
  options?: string[];
  questionOptions?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  memoryPairs?: Array<{
    id: string;
    content: string;
    matchId: string;
    type: "text" | "image";
  }>;
}

// Complete question data structure for parent component
export interface CompleteQuestionData {
  _id: string;
  type: QuestionType;
  qType: string;
  questionText: string;
  questionSubHeading?: string;
  image?: string | File | null;
  options: string[];
  questionOptions?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  memoryPairs?: Array<{
    id: string;
    content: string;
    type: "text" | "image";
    matchId: string;
  }>;
}

const darkFieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: 0,
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "#96FF43" },
    "&.Mui-focused fieldset": { borderColor: "#96FF43" },
  },
  "& .MuiInputLabel-root": { color: "#ccc" },
  "& .MuiSelect-icon": { color: "#ccc", borderRadius: "0" },
  "& .MuiInputBase-root": {
    borderRadius: "0",
  },
  "& fieldset": {
    borderRadius: 0,
  },
};

interface AddAssessmentProps {
  data: CompleteQuestionData[];
  setData: React.Dispatch<React.SetStateAction<CompleteQuestionData[]>>;
}

const AddAssessment: React.FC<AddAssessmentProps> = ({ data, setData }) => {
  // Form data state (for FormBuilder)
  const [formQuestions, setFormQuestions] = useState<QuestionData[]>(
    data || [
      {
        type: "MULTIPLE_CHOICE",
        questionText: "",
        options: [],
        correctAnswer: "",
        explanation: "",
        image: null,
      },
    ]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Memory pairs state for each question (if needed)
  // Helper to convert flat memoryPairs array to pairs grouped by matchId
  function groupMemoryPairs(
    memoryPairs?: Array<{
      id: string;
      content: string;
      matchId: string;
      type: "text" | "image";
    }>
  ): MemoryPair[] {
    if (!memoryPairs || memoryPairs.length === 0) {
      return [
        {
          matchId: "pair1",
          item1: { content: "", type: "text" },
          item2: { content: "", type: "text" },
        },
      ];
    }
    // Group by matchId
    const grouped: Record<string, { item1?: any; item2?: any }> = {};
    memoryPairs.forEach((item) => {
      if (!grouped[item.matchId]) grouped[item.matchId] = {};
      if (!grouped[item.matchId].item1) grouped[item.matchId].item1 = item;
      else grouped[item.matchId].item2 = item;
    });
    return Object.entries(grouped).map(([matchId, { item1, item2 }]) => ({
      matchId,
      item1: item1
        ? { id: item1.id, content: item1.content, type: item1.type }
        : { content: "", type: "text" },
      item2: item2
        ? { id: item2.id, content: item2.content, type: item2.type }
        : { content: "", type: "text" },
    }));
  }

  const [memoryPairsArr, setMemoryPairsArr] = useState<MemoryPair[][]>(
    data && data.length > 0
      ? data.map((item) => groupMemoryPairs(item.memoryPairs))
      : [
          [
            {
              matchId: "pair1",
              item1: { content: "", type: "text" },
              item2: { content: "", type: "text" },
            },
          ],
        ]
  );

  // Initialize form data from parent data if available
  useEffect(() => {
    if (data && data.length > 0) {
      const convertedFormData = data.map((item) => ({
        _id: item._id,
        type: item.type,
        questionText: item.questionText,
        questionSubHeading: item.questionSubHeading,
        image: item.image || null, // Initialize image properly
        options: item.options,
        questionOptions: item.questionOptions,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        memoryPairs: item.memoryPairs,
      }));
      setFormQuestions(convertedFormData);
      console.log(convertedFormData);
    }
  }, []);

  // Helper to get current question/memoryPairs
  const questionData = useMemo(
    () =>
      formQuestions[currentIndex] || {
        _id: "",
        type: "",
        questionText: "",
        questionSubHeading: "",
        image: "",
        options: [],
        questionOptions: [],
        correctAnswer: "",
        explanation: "",
        memoryPairs: Array<{
          id: "";
          content: "";
          matchId: "";
          type: "text" | "image";
        }>(),
      },
    [formQuestions, currentIndex]
  );
  // useEffect(() => {
  //   console.log("questionData", questionData);
  // }, [questionData]);

  const memoryPairs = memoryPairsArr[currentIndex] || [
    {
      id: "pair1",
      item1: { content: "", type: "text" },
      item2: { content: "", type: "text" },
    },
  ];

  // Convert form data to complete data structure
  const convertToCompleteData = (
    formData: QuestionData[]
  ): CompleteQuestionData[] => {
    return formData.map((question) => {
      const baseData = {
        _id: question._id,
        type: question.type,
        questionText: question.questionText,
        questionSubHeading: question.questionSubHeading,
        image: question.image,
        options: question.options || [],
        questionOptions: question.questionOptions,
        correctAnswer: question.correctAnswer || "",
        explanation: question.explanation,
        memoryPairs: question.memoryPairs,
      };

      // Map question types to Preview component types
      switch (question.type) {
        case "MULTIPLE_CHOICE":
          return {
            ...baseData,
            qType: "MULTIPLE_CHOICE",
          };
        case "TWO_CHOICE":
          return {
            ...baseData,
            qType: "TWO_CHOICE",
          };
        case "DRAG_ORDER":
          return {
            ...baseData,
            qType: "DRAG_ORDER",
          };
        case "MEMORY_MATCH":
          return {
            ...baseData,
            qType: "MEMORY_MATCH",
          };
        default:
          return {
            ...baseData,
            qType: "MULTIPLE_CHOICE",
          };
      }
    });
  };

  // Update parent data whenever form data changes
  useEffect(() => {
    const completeData = convertToCompleteData(formQuestions);
    setData(completeData);
  }, [formQuestions, setData]);

  // Update question fields
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        [fieldName]: value,
      };
      return updated;
    });
  };

  // Memory pairs management for current question
  const addMemoryPair = () => {
    const newPair: MemoryPair = {
      matchId: `pair${memoryPairs.length + 1}`,
      item1: {
        id: "",
        content: "",
        type: "text",
      },
      item2: {
        id: "",
        content: "",
        type: "text",
      },
    };
    const updatedPairs = [...memoryPairs, newPair];
    updateMemoryPairsInQuestionData(updatedPairs);
    setMemoryPairsArr((prev) => {
      const arr = [...prev];
      arr[currentIndex] = updatedPairs;
      return arr;
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const removeMemoryPair = (index: number) => {
    if (memoryPairs.length > 1) {
      const updatedPairs = memoryPairs.filter((_, i) => i !== index);
      updateMemoryPairsInQuestionData(updatedPairs);
      setMemoryPairsArr((prev) => {
        const arr = [...prev];
        arr[currentIndex] = updatedPairs;
        return arr;
      });
    }
  };

  const updateMemoryPair = (
    pairIndex: number,
    itemKey: "item1" | "item2",
    field: "content" | "type",
    value: string
  ) => {
    const updatedPairs = [...memoryPairs];
    updatedPairs[pairIndex][itemKey][field] = value as any;
    updateMemoryPairsInQuestionData(updatedPairs);
    setMemoryPairsArr((prev) => {
      const arr = [...prev];
      arr[currentIndex] = updatedPairs;
      return arr;
    });
  };

  const updateMemoryPairsInQuestionData = (pairs: MemoryPair[]) => {
    const memoryTiles: any[] = [];
    pairs.forEach((pair) => {
      memoryTiles.push({
        id: `${pair.item1.id}_item1`,
        content: pair.item1.content,
        matchId: pair.matchId,
        type: pair.item1.type,
      });
      memoryTiles.push({
        id: `${pair.item2.id}_item2`,
        content: pair.item2.content,
        matchId: pair.matchId,
        type: pair.item2.type,
      });
    });
    setFormQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        memoryPairs: memoryTiles,
      };
      return updated;
    });
  };

  // Add/remove question logic
  const addQuestion = () => {
    setFormQuestions((prev) => [
      ...prev,
      {
        _id: "",
        type: "MULTIPLE_CHOICE",
        questionText: "",
        options: [],
        correctAnswer: "",
        explanation: "",
        image: null,
      },
    ]);
    setMemoryPairsArr((prev) => [
      ...prev,
      [
        {
          matchId: "pair1",
          item1: { id: "", content: "", type: "text" },
          item2: { id: "", content: "", type: "text" },
        },
      ],
    ]);
    setCurrentIndex(formQuestions.length);
  };

  const removeQuestion = () => {
    if (formQuestions.length === 1) return;
    const updatedQuestions = formQuestions.filter(
      (_, idx) => idx !== currentIndex
    );
    const updatedMemoryPairsArr = memoryPairsArr.filter(
      (_, idx) => idx !== currentIndex
    );
    setFormQuestions(updatedQuestions);
    setMemoryPairsArr(updatedMemoryPairsArr);
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handlePageChange = (_: any, value: number) => {
    setCurrentIndex(value - 1);
  };

  // Convert our question data to the format expected by Preview component
  const getPreviewData = () => {
    const completeDataArray = convertToCompleteData(formQuestions);
    return completeDataArray[currentIndex];
  };

  // Base fields that appear for all question types
  const getBaseFields = (): FieldConfig[] => [
    {
      name: "type",
      label: "Question Type",
      type: "select",
      required: true,
      options: [
        { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
        { value: "TWO_CHOICE", label: "Right/Wrong (Two Options)" },
        { value: "DRAG_ORDER", label: "Re-Arrange (Drag Order)" },
        { value: "MEMORY_MATCH", label: "Match The Following" },
      ],
    },
    {
      name: "questionText",
      label: "Question Text",
      type: "textarea",
      required: true,
      placeholder: "Enter your question here...",
      rows: 3,
    },
  ];

  // Get specific fields based on question type
  const getSpecificFields = (): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    switch (questionData.type) {
      case "MULTIPLE_CHOICE":
        fields.push(
          {
            name: "options",
            label: "Answer Options",
            type: "array",
            required: true,
            arrayConfig: {
              maxItems: 4,
              itemLabel: "Option",
              itemPlaceholder: "Enter option text...",
            },
          },
          {
            name: "correctAnswer",
            label: "Correct Answer",
            type: "text",
            required: true,
            placeholder:
              "Enter the correct answer exactly as it appears in options",
          },
          {
            name: "explanation",
            label: "Explanation",
            type: "textarea",
            placeholder: "Explain why this is the correct answer...",
            rows: 3,
          }
        );
        break;

      case "TWO_CHOICE":
        fields.push(
          {
            name: "image",
            label: "Question Image",
            type: "image", // Change from "text" to "image"
            placeholder: "Upload image or enter URL",
          },
          {
            name: "correctAnswer",
            label: "Correct Answer",
            type: "radio",
            required: true,
            options: [
              { value: "right", label: "Right" },
              { value: "wrong", label: "Wrong" },
            ],
          }
        );
        break;
      case "DRAG_ORDER":
        fields.push(
          {
            name: "questionSubHeading",
            label: "Question Sub-heading",
            type: "text",
            placeholder: 'e.g., "Arrange in correct order"',
          },
          {
            name: "options",
            label: "Items to Arrange",
            type: "array",
            required: true,
            arrayConfig: {
              maxItems: 6,
              itemLabel: "Item",
              itemPlaceholder: "Enter item to be arranged...",
            },
          },
          {
            name: "correctAnswer",
            label: "Correct Order (Comma-separated)",
            type: "textarea",
            required: true,
            placeholder: "Enter items in correct order, separated by commas...",
            rows: 2,
          },
          {
            name: "explanation",
            label: "Explanation",
            type: "textarea",
            placeholder: "Explain the correct order...",
            rows: 3,
          }
        );
        break;
    }

    return fields;
  };

  const renderMemoryMatchFields = () => {
    if (questionData.type !== "MEMORY_MATCH") return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Card
          sx={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            borderRadius: "0",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" color="#96FF43">
                Memory Pairs ({memoryPairs.length})
              </Typography>
              <Button
                onClick={addMemoryPair}
                startIcon={<Add />}
                sx={{
                  backgroundColor: "#96FF43",
                  borderRadius: 0,
                  color: "black",
                  "&:hover": { backgroundColor: "#7BD932" },
                }}
              >
                Add Pair
              </Button>
            </Box>

            <Alert
              severity="info"
              sx={{
                mb: 3,
                backgroundColor: "#1a3a4a",
                color: "white",
                "& .MuiAlert-icon": { color: "#96FF43" },
              }}
            >
              Create pairs of items that players need to match. Each pair can
              contain text or images. Players will need to find matching pairs
              by flipping cards.
            </Alert>

            {memoryPairs.map((pair, pairIndex) => (
              <Card
                key={pair.item1.id}
                sx={{
                  mb: 2,
                  backgroundColor: "#333",
                  border: "1px solid #555",
                  borderRadius: "0",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="subtitle1" color="#96FF43">
                      Pair {pairIndex + 1}
                    </Typography>
                    {memoryPairs.length > 1 && (
                      <IconButton
                        onClick={() => removeMemoryPair(pairIndex)}
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

                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                    {/* First Item */}
                    <Box>
                      <Typography variant="subtitle2" color="white" mb={1}>
                        First Item
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography sx={{ color: "white" }}>Type</Typography>
                        <Select
                          value={pair.item1.type}
                          onChange={(e) =>
                            updateMemoryPair(
                              pairIndex,
                              "item1",
                              "type",
                              e.target.value
                            )
                          }
                          sx={darkFieldStyle}
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="image">Image URL</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography sx={{ color: "white", mb: 1 }}>
                        {pair.item1.type === "text"
                          ? "Text Content"
                          : "Image URL"}
                      </Typography>
                      <TextField
                        fullWidth
                        value={pair.item1.content}
                        onChange={(e) =>
                          updateMemoryPair(
                            pairIndex,
                            "item1",
                            "content",
                            e.target.value
                          )
                        }
                        placeholder={
                          pair.item1.type === "text"
                            ? "Enter text to display"
                            : "https://example.com/image.jpg"
                        }
                        multiline={pair.item1.type === "text"}
                        rows={pair.item1.type === "text" ? 2 : 1}
                        sx={darkFieldStyle}
                      />
                    </Box>

                    {/* Second Item */}
                    <Box>
                      <Typography variant="subtitle2" color="white" mb={1}>
                        Second Item (Match)
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography sx={{ color: "white" }}>Type</Typography>
                        <Select
                          value={pair.item2.type}
                          onChange={(e) =>
                            updateMemoryPair(
                              pairIndex,
                              "item2",
                              "type",
                              e.target.value
                            )
                          }
                          sx={darkFieldStyle}
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="image">Image URL</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography sx={{ color: "white", mb: 1 }}>
                        {pair.item2.type === "text"
                          ? "Text Content"
                          : "Image URL"}
                      </Typography>
                      <TextField
                        fullWidth
                        value={pair.item2.content}
                        onChange={(e) =>
                          updateMemoryPair(
                            pairIndex,
                            "item2",
                            "content",
                            e.target.value
                          )
                        }
                        placeholder={
                          pair.item2.type === "text"
                            ? "Enter text to display"
                            : "https://example.com/image.jpg"
                        }
                        multiline={pair.item2.type === "text"}
                        rows={pair.item2.type === "text" ? 2 : 1}
                        sx={darkFieldStyle}
                      />
                    </Box>
                  </Box>

                  {/* Preview */}
                  {(pair.item1.content || pair.item2.content) && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#1a1a1a",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="#96FF43"
                        mb={1}
                        display="block"
                      >
                        Preview:
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Box
                          sx={{
                            flex: 1,
                            textAlign: "center",
                            p: 1,
                            backgroundColor: "#333",
                            borderRadius: 1,
                          }}
                        >
                          {pair.item1.type === "text" ? (
                            <Typography color="white" variant="body2">
                              {pair.item1.content || "Empty"}
                            </Typography>
                          ) : (
                            pair.item1.content && (
                              <img
                                src={pair.item1.content}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "60px" }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            )
                          )}
                        </Box>
                        <Typography color="white" sx={{ alignSelf: "center" }}>
                          ↔
                        </Typography>
                        <Box
                          sx={{
                            flex: 1,
                            textAlign: "center",
                            p: 1,
                            backgroundColor: "#333",
                            borderRadius: 1,
                          }}
                        >
                          {pair.item2.type === "text" ? (
                            <Typography color="white" variant="body2">
                              {pair.item2.content || "Empty"}
                            </Typography>
                          ) : (
                            pair.item2.content && (
                              <img
                                src={pair.item2.content}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "60px" }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const allFields =
    questionData.type === "MEMORY_MATCH"
      ? getBaseFields()
      : [...getBaseFields(), ...getSpecificFields()];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Box
            display="flex"
            alignItems="center"
            mb={2}
            justifyContent={"space-between"}
          >
            <Typography variant="h6">
              Question {currentIndex + 1} of {formQuestions.length}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={addQuestion}
                startIcon={<Add />}
                sx={{
                  bgcolor: "#96FF43",
                  color: "black",
                  minWidth: 0,
                  px: 2,
                  borderRadius: 0,
                  "&:hover": {
                    bgcolor: "#7BD932",
                  },
                }}
              >
                Add Question
              </Button>
              {formQuestions.length > 1 && (
                <IconButton
                  onClick={removeQuestion}
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
          <FormBuilder
            fields={allFields}
            data={questionData}
            onChange={handleFieldChange}
          />
          {renderMemoryMatchFields()}
        </Grid>
        <Grid size={6}>
          <Preview quetionData={getPreviewData()} />
        </Grid>
      </Grid>
      {/* Pagination for questions */}
      {formQuestions.length > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={formQuestions.length}
            page={currentIndex + 1}
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
    </Box>
  );
};

export default AddAssessment;
