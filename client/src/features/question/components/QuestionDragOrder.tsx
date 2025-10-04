// components/QuestionDragOrder.tsx
import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Typography, useTheme } from "@mui/material";
import { QuestionProps } from "../Types/types";
import GlobalButton from "../../../components/ui/button";

const SortableItem = ({
  id,
  // index,
  color,
}: {
  id: string;
  index: number;
  color: string;
}) => {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    color: "black",
    transition,
    padding: "12px 20px",
    backgroundColor: color || "rgba(14, 14, 14, 1)",
    marginBottom: "12px",
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: "0px 4px 19px 0px #CD7BFF4D inset",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {id}
    </div>
  );
};

const QuestionDragOrder: React.FC<QuestionProps> = ({
  id,
  questionSubHeading,
  questionText,
  options = [],
  correctAnswer,
  explanation,
  onAnswer,
}) => {
  let correctOrder: string[] = [];

  if (Array.isArray(correctAnswer)) {
    correctOrder = correctAnswer.map((opt) => opt.trim());
  } else {
    console.error("Invalid correctAnswer format:", correctAnswer);
  }

  const [items, setItems] = useState<string[]>(
    options.map((opt) =>
      typeof opt === "string" ? opt : (opt as any).name ?? ""
    )
  );
  const [showResult, setShowResult] = useState(false);
  const [showExplation, setShowExplation] = useState(false);
  const [resultColors, setResultColors] = useState<string[]>(
    options.map(() => "white")
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSubmit = () => {
    const colors = items.map((item, index) =>
      item === correctOrder[index] ? "primary.main" : "#FF6666"
    );
    setResultColors(colors);
    setShowExplation(true);
  };

  const handleExplanation = () => {
    setShowResult(true);
  };

  const handleRedo = () => {
    setItems(
      options.map((opt) =>
        typeof opt === "string" ? opt : (opt as any).name ?? ""
      )
    );
    setShowResult(false);
    setShowExplation(false);
    setResultColors(options.map(() => "rgba(14, 14, 14, 1)"));
  };

  return (
    <>
      {showResult ? (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          {/* Explanation Card */}
          <Box
            px={1}
            py={3}
            width="100%"
            color={"black"}
            bgcolor="#fff"
            textAlign="left"
          >
            <Typography variant="h5" mb={1} textAlign="center">
              ✅ Correct Answer
            </Typography>
            <span dangerouslySetInnerHTML={{ __html: explanation ?? "" }} />
          </Box>

          {/* Buttons at Bottom */}
          <Box display="flex" width="100%" mt={"20px "}>
            <GlobalButton
              onClick={handleRedo}
              sx={{ flex: 1, bgcolor: "rgba(70, 70, 70, 1)", color: "white" }}
            >
              Redo
            </GlobalButton>
            <GlobalButton
              onClick={() => onAnswer?.(items, id)}
              sx={{
                flex: 1,
                background: "rgba(37, 37, 37, 1)",
                color: "white",
              }}
            >
              Next
            </GlobalButton>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" color="primary.main">
            {questionSubHeading}
          </Typography>
          <Typography fontWeight={"300"} fontSize={"16px"} mb={"52px"}>
            {questionText}
          </Typography>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, index) => (
                <SortableItem
                  key={item}
                  id={item}
                  index={index}
                  color={resultColors[index]}
                />
              ))}
            </SortableContext>
          </DndContext>

          {showExplation ? (
            <GlobalButton onClick={handleExplanation} sx={{ mt: "20px" }}>
              Show Explanation
            </GlobalButton>
          ) : (
            <GlobalButton onClick={handleSubmit} sx={{ mt: "20px" }}>
              Submit
            </GlobalButton>
          )}
        </Box>
      )}
    </>
  );
};

export default QuestionDragOrder;
