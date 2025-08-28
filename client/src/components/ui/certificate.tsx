import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

type CertificateProps = {
  recipientName: string;
  moduleName?: string;
  date?: string;
  signature?: string;
  logo?: string;
};

const Certificate: React.FC<CertificateProps> = ({
  recipientName,
  //   moduleName,
  //   date,
  //   signature,
  //   logo,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        // background: "linear-gradient(180deg, #404040 0%, #A6A6A6 100%)",
        border: `4px solid ${theme.palette.primary.main}`,
        bgcolor: "white",
        textAlign: "center",
        p: "18px 4px 10px 4px",
        // color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h4">Certificate of Completion</Typography>
        <Typography variant="h6" fontWeight={400} mt={1} fontStyle="italic">
          This is to certify that
        </Typography>
      </Box>

      <Typography
        variant="h5"
        fontWeight="medium"
        mt={4}
        sx={{
          borderBottom: `0.5px solid #CD7BFF4D`,
          mx: 4,
          // mb: 1,
        }}
      >
        {recipientName}
      </Typography>

      <Typography variant="h6" fontWeight={400} fontStyle="italic">
        has successfully completed
      </Typography>
      <Typography variant="h4" mt={1}>
        Module
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Box>
          <Box sx={{ border: `0.5px solid #CD7BFF4D` }} />
          <Typography fontWeight={400} fontSize={"8px"} fontStyle="italic">
            Date of completion
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              // background: "linear-gradient(180deg, #404040 0%, #A6A6A6 100%)",
              width: 50,
              height: 50,
              mx: "auto",
              borderRadius: "50%",
            }}
          />
          <Typography variant="h6" fontWeight={400} fontStyle="italic">
            Company logo
          </Typography>
        </Box>
        <Box>
          <Box sx={{ border: `0.5px solid #CD7BFF4D` }} />
          <Typography fontWeight={400} fontSize={"8px"} fontStyle="italic">
            Awarded by (Signature)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Certificate;
