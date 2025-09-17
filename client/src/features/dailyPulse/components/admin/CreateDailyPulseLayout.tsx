import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import InfoCard from "../../../question/components/InfoCard";
import QuestionTwoOption from "../../../question/components/QuestionTwoOption";
import GreenButton from "../../../../components/ui/GreenButton";
import { useNavigate } from "react-router-dom";

const CreateDailyPulseLayout: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState("");

  const templates = [
    {
      id: "flashcard",
      title: "Flashcard",
      component: (
        <InfoCard
          id="flashcard-demo"
          title="Did you know?"
          content="The POSH Act, 2013 is a law that protects women from sexual harassment at the workplace. It defines what counts as harassment and outlines rules for employers and employees."
          wantFeedback={true}
          onClickFeedback={(feedback, _id) =>
            console.log("Feedback:", feedback)
          }
        />
      ),
    },
    {
      id: "multiple-choice",
      title: "Multiple Choice",
      component: (
        <QuestionTwoOption
          id="mcq-demo"
          questionOptions={["A - Opinion A", "B - Opinion B"]}
          questionText="What do you think about this? Give Your opinion."
          optionType="text"
          options={["A", "B"]}
          onAnswer={(answer, _id) => console.log("Answer:", answer)}
        />
      ),
    },
    {
      id: "multiple-images",
      title: "Multiple Images",
      component: (
        <QuestionTwoOption
          id="image-demo"
          questionText="Choose what you think would be relevant?"
          optionType="image"
          options={[
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop",
          ]}
          onAnswer={(answer, _id) => console.log("Answer:", answer)}
        />
      ),
    },
    {
      id: "right-wrong",
      title: "Right/Wrong",
      component: (
        <QuestionTwoOption
          id="correct-incorrect-demo"
          questionText="Is this correct or not?"
          optionType="correct-incorrect"
          options={["right", "wrong"]}
          onAnswer={(answer, _id) => console.log("Answer:", answer)}
          image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop"
        />
      ),
    },
  ];

  const creations = [
    { name: "Multiple choice", status: "Draft", timeLeft: "24mins left" },
    { name: "Multiple images", status: "Draft", timeLeft: "" },
    { name: "Did you know?", status: "Reviewed", timeLeft: "" },
    { name: "Right or wrong", status: "In Process", timeLeft: "24mins left" },
    { name: "50 cards", status: "", timeLeft: "24mins left" },
  ];

  const navigate = useNavigate();
  const handleCreate = () => {
    console.log("Creating with content:", generatedContent);
    navigate("/admin/learnings/dailyPulse/review");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial, sans-serif",
        p: "24px",
      }}
    >
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Your Creations
        </Typography>

        {/* Creations Grid */}
        <Grid
          container
          sx={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          {creations.map((creation, index) => (
            <Grid
              size={2.2}
              key={index}
              sx={{
                backgroundColor: "#333",
                p: 2,
                borderRadius: 1,
                border: "1px solid #444",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                {creation.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#888", mb: 0.5 }}>
                {creation.status}
              </Typography>
              {creation.timeLeft && (
                <Typography variant="body2" sx={{ color: "#888" }}>
                  {creation.timeLeft}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Templates Section */}
      <Box sx={{ p: "30px", background: "black" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: "30px" }}>
          Templates
        </Typography>

        <Grid
          justifyContent={"space-between"}
          container
          sx={{
            gap: 3,
            mb: 4,
          }}
        >
          {templates.map((template) => (
            <Grid
              size={3.5}
              key={template.id}
              p={"24px"}
              sx={{
                backgroundColor: "black",
                border:
                  selectedTemplate === template.id
                    ? "2px solid #96FF43"
                    : "1px solid #444",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#666",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <Box sx={{ p: 2, textAlign: "center", backgroundColor: "black" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {template.title}
                </Typography>
              </Box>
              <Box>{template.component}</Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Generate Section */}
      <Box sx={{ p: "26px", background: "black" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Generate
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Ask anything"
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            sx={{
              backgroundColor: "#333",
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#666",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00ff00",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#888",
                opacity: 1,
              },
              "& .MuiInputBase-root": {
                  borderRadius: "0",
                },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              textAlign: "right",
              mt: 1,
            }}
          >
            You can upload any PPT, Word file, Doc
            <Button
              variant="outlined"
              size="small"
              sx={{
                ml: 2,
                borderColor: "#444",
                "&:hover": {
                  borderColor: "#666",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Upload +
            </Button>
          </Typography>
        </Box>
      </Box>
      <Box mt={"30px"}>
        <GreenButton onClick={handleCreate} sx={{minWidth:"180px"}}>Create</GreenButton>
      </Box>
    </Box>
  );
};

export default CreateDailyPulseLayout;
