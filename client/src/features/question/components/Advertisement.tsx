import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { QuestionProps } from "../Types/types";

// Advertisement pulse renders: header (company name), image, and a single CTA "Interested"
const Advertisement: React.FC<QuestionProps> = ({
  id,
  questionText,
  image,
  response,
  onAnswer,
  smallSize = false,
  sx = {},
}) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<string | undefined>(response);

  useEffect(() => {
    setSelected(response);
  }, [response]);

  const options = useMemo(() => ["Interested"], []);

  const handleClick = () => {
    if (!selected && onAnswer) {
      setSelected(options[0]);
      onAnswer(options[0], id);
    }
  };

  //   const showResults = !!selected;

  const resolvedImage =
    typeof image === "string"
      ? image
      : image instanceof File
      ? URL.createObjectURL(image)
      : undefined;

  return (
    <Box
      border={`2px solid ${theme.palette.primary.main}`}
      boxShadow="0px 4px 19px 0px #CD7BFF4D inset"
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      sx={sx}
    >
      {/* Header: company name */}
      <Box p={smallSize ? "10px" : "14px"} textAlign="left">
        <Typography variant={smallSize ? "h6" : "h2"} color="black">
          {questionText}
        </Typography>
      </Box>

      {/* Image */}
      {resolvedImage && (
        <Box
          component="img"
          src={resolvedImage}
          alt={questionText}
          sx={{
            width: "100%",
            height: smallSize ? "140px" : "280px",
            objectFit: "cover",
          }}
        />
      )}

      {/* CTA / Results */}
      {response ? (
        <></>
      ) : (
        <Box>
          <Box
            onClick={handleClick}
            sx={{ cursor: onAnswer ? "pointer" : "default" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            py="18px"
            bgcolor="#CD7BFF4D"
            borderTop={`1px solid ${theme.palette.primary.main}`}
            color={"black"}
            fontSize={smallSize ? "15px" : "30px"}
          >
            Interested
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Advertisement;
