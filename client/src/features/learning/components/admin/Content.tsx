import { OptionType } from "../../../question/Types/types";
import FormBuilder, {
  FieldConfig,
} from "../../../../components/ui/FromBuilder";
import Preview from "../../../../components/ui/Preview";
import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Box,
  Button,
  IconButton,
  Typography,
  Pagination,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import DOMPurify from "dompurify";

interface ContentProps {
  type: string;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

const Content: React.FC<ContentProps> = ({ type, data, setData }) => {
  const [page, setPage] = useState(0);

  const defaultQuestion = useMemo(
    () => ({
      _id: data[page]?._id || "",
      subHeading: data[page]?.questionSubHeading || "",
      heading: data[page]?.questionText || "",
      content: data[page]?.questionText || "",
      explanation: DOMPurify.sanitize(data[page]?.explanation) || "",
      correctAnswer: data[page]?.correctAnswer || "",
    }),
    [page]
  );

  const defaultVideo = {
    url: data || "",
  };

  const handleFieldChange = (field: string, value: any) => {
    setData((prev) => {
      const updated = [...prev];
      updated[page] = {
        ...updated[page],
        [field]: value,
      };
      return updated;
    });
  };

  const addEntry = () => {
    setData((prev) => [
      ...prev,
      type === "question" ? { ...defaultQuestion } : { ...defaultVideo },
    ]);
    // console.log(data);
    // console.log(page);
    setPage(data.length); // move to the new entry
  };

  const removeEntry = () => {
    if (data.length <= 1) return;
    const updated = data.filter((_, i) => i !== page);
    setData(updated);
    setPage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const [currentData, setCurrentData] = useState(
    data?.[page] || (type === "question" ? defaultQuestion : defaultVideo)
  );

  useEffect(() => {
    // console.log(data);
    setCurrentData(
      data?.[page] || (type === "question" ? defaultQuestion : defaultVideo)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page, type]);

  const questionData = {
    _id: currentData?._id || "",
    type: "Right Wrong",
    questionText: currentData?.content || "",
    questionSubHeading: currentData?.heading || "",
    questionSubText: currentData?.subHeading || "",
    options: ["right", "wrong"],
    correctAnswer: currentData?.correctAnswer || "",
    image: "",
    explanation: currentData?.explanation || "",
    qType: "TWO_CHOICE",
    optionType: "correct-incorrect" as OptionType,
  };

  const fields: FieldConfig[] =
    type === "question"
      ? [
          {
            name: "subHeading",
            label: "Sub – Heading",
            type: "text",
            placeholder: "Enter sub heading",
          },
          {
            name: "heading",
            label: "Heading",
            type: "text",
            required: true,
            placeholder: "Enter heading",
          },
          {
            name: "content",
            label: "Content – 100 words",
            type: "textarea",
            rows: 6,
            placeholder: "Enter your content here...",
          },
          {
            name: "explanation",
            label: "Explanation",
            type: "richtext",
            rows: 6,
            placeholder: "Enter your explanation here...",
          },
        ]
      : [
          {
            name: "url",
            label: "URL for Video",
            type: "text",
            placeholder: "Enter video URL",
          },
        ];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          {type === "question" && (
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                Question {page + 1} of {data.length}
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  onClick={addEntry}
                  startIcon={<Add />}
                  sx={{
                    bgcolor: "#96FF43",
                    color: "black",
                    px: 2,
                    borderRadius: 0,
                    "&:hover": { bgcolor: "#7BD932" },
                  }}
                >
                  Add
                </Button>
                {data.length > 1 && (
                  <IconButton
                    onClick={removeEntry}
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
          )}

          <FormBuilder
            fields={fields}
            data={currentData}
            onChange={(field, value) => handleFieldChange(field, value)}
          />
        </Grid>

        {type === "question" && (
          <Grid size={6}>
            <Preview quetionData={questionData} />
          </Grid>
        )}
      </Grid>

      {type === "question" && data.length > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={data.length}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white",
                borderColor: "#444",
                "&:hover": { backgroundColor: "#333" },
                "&.Mui-selected": {
                  backgroundColor: "#96FF43",
                  color: "black",
                  "&:hover": { backgroundColor: "#7BD932" },
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

export default Content;
