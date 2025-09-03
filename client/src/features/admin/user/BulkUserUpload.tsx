import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  useTheme,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { useBulkUploadUsersMutation } from "../service/adminApi";
import GreenButton from "../../../components/ui/GreenButton";

interface UserData {
  name: string;
  companyMail: string;
  contact: string;
  address: string;
  chapter: string;
  businessName: string;
  instagram: string;
  facebook: string;
  businessCategory: string;
  specialisation: string;
}

interface UploadResult {
  success: boolean;
  totalRows: number;
  successfullyCreated: number;
  errors?: Array<{
    row: number;
    data: UserData;
    error: string;
  }>;
  duplicates?: Array<{
    row: number;
    data: UserData;
    existingUser: {
      _id: string;
      name: string;
      companyMail: string;
    };
  }>;
}

const BulkUserUpload: React.FC = () => {
  const [bulkUploadUsers, { isLoading }] = useBulkUploadUsersMutation();
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<UserData[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);

  // Sample template data
  const sampleData = [
    {
      Name: "John Doe",
      "Company Email": "john.doe@company.com",
      Contact: "9876543210",
      Address: "123 Main Street, City, State, 12345",
      Chapter: "Mumbai Chapter",
      "Business Name": "Doe Enterprises",
      Instagram: "@doe_enterprises",
      Facebook: "fb.com/doe.enterprises",
      "Business Category": "Technology",
      Specialisation: "Software Development",
    },
    {
      Name: "Jane Smith",
      "Company Email": "jane.smith@company.com",
      Contact: "9876543211",
      Address: "456 Oak Avenue, City, State, 12346",
      Chapter: "Delhi Chapter",
      "Business Name": "Smith Solutions",
      Instagram: "@smith_solutions",
      Facebook: "fb.com/smith.solutions",
      "Business Category": "Consulting",
      Specialisation: "Business Strategy",
    },
  ];

  // Download sample template
  const downloadSampleTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "user_upload_template.xlsx");
  };

  // Validate Excel data
  const validateExcelData = (
    data: any[]
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const requiredColumns = ["Name", "Company Email"];

    if (data.length === 0) {
      errors.push("Excel file is empty");
      return { isValid: false, errors };
    }

    // Check if required columns exist
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    for (const col of requiredColumns) {
      if (!columns.includes(col)) {
        errors.push(`Missing required column: ${col}`);
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Validate data rows
    data.forEach((row, index) => {
      const rowNumber = index + 1;

      if (!row.Name || row.Name.trim() === "") {
        errors.push(`Row ${rowNumber}: Name is required`);
      }

      if (!row["Company Email"] || row["Company Email"].trim() === "") {
        errors.push(`Row ${rowNumber}: Company Email is required`);
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(row["Company Email"])) {
          errors.push(`Row ${rowNumber}: Invalid email format`);
        }
      }

      if (row.Contact && !/^\d{10}$/.test(row.Contact)) {
        errors.push(`Row ${rowNumber}: Contact must be exactly 10 digits`);
      }

      // Validate Instagram format (should start with @)
      if (
        row.Instagram &&
        row.Instagram.trim() &&
        !row.Instagram.trim().startsWith("@")
      ) {
        errors.push(`Row ${rowNumber}: Instagram handle should start with @`);
      }

      // Validate Facebook URL format
      if (
        row.Facebook &&
        row.Facebook.trim() &&
        !row.Facebook.includes("facebook.com") &&
        !row.Facebook.includes("fb.com")
      ) {
        errors.push(
          `Row ${rowNumber}: Facebook should be a valid Facebook URL`
        );
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  // Process uploaded file
  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validation = validateExcelData(jsonData);

        if (!validation.isValid) {
          setValidationErrors(validation.errors);
          setParsedData([]);
          setUploadResult(null);
          return;
        }

        // Transform data to match backend expectations
        const transformedData: UserData[] = jsonData.map((row: any) => ({
          name: row.Name?.trim() || "",
          companyMail: row["Company Email"]?.trim().toLowerCase() || "",
          contact: row.Contact?.trim() || "",
          address: row.Address?.trim() || "",
          chapter: row.Chapter?.trim() || "",
          businessName: row["Business Name"]?.trim() || "",
          instagram: row.Instagram?.trim() || "",
          facebook: row.Facebook?.trim() || "",
          businessCategory: row["Business Category"]?.trim() || "",
          specialisation: row.Specialisation?.trim() || "",
        }));

        setParsedData(transformedData);
        setValidationErrors([]);
        setUploadResult(null);
      } catch (error) {
        setValidationErrors([
          "Error reading Excel file. Please ensure it's a valid Excel file.",
        ]);
        setParsedData([]);
        setUploadResult(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  // Handle upload
  const handleUpload = async () => {
    if (parsedData.length === 0) return;

    try {
      const result = await bulkUploadUsers(parsedData).unwrap();
      // Ensure we have default values for arrays
      const safeResult = {
        success: result.success || false,
        totalRows: result.totalRows || parsedData.length,
        successfullyCreated: result.successfullyCreated || 0,
        errors: result.errors || [],
        duplicates: result.duplicates || [],
      };
      setUploadResult(safeResult);
    } catch (error: any) {
      setUploadResult({
        success: false,
        totalRows: parsedData.length,
        successfullyCreated: 0,
        errors: [
          {
            row: 0,
            data: parsedData[0] || {},
            error: error?.data?.message || "Upload failed",
          },
        ],
        duplicates: [],
      });
    }
  };

  const resetUpload = () => {
    setParsedData([]);
    setValidationErrors([]);
    setUploadResult(null);
    setShowErrors(false);
    setShowDuplicates(false);
  };
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* Upload Section */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: theme.palette.text.secondary,
          borderRadius: 0,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
            Upload excel file
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed white",
              borderRadius: 0,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragActive
                ? "rgba(160, 74, 212, 0.1)"
                : "transparent",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "rgba(160, 74, 212, 0.05)",
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: "white", mb: 2 }} />
            <Typography variant="body1" sx={{ color: "white", mb: 1 }}>
              {isDragActive
                ? "Drop the Excel file here..."
                : "Drag & drop an Excel file here, or click to select"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              Supported formats: .xlsx, .xls
            </Typography>
          </Box>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 0 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Validation Errors:
              </Typography>
              {validationErrors.map((error, index) => (
                <Typography key={index} variant="body2">
                  • {error}
                </Typography>
              ))}
            </Alert>
          )}

          {/* Parsed Data Preview */}
          {parsedData.length > 0 && validationErrors.length === 0 && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Successfully parsed {parsedData.length} users from Excel file.
                </Typography>
              </Alert>

              <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                <GreenButton onClick={handleUpload} disabled={isLoading}>
                  Upload Users
                </GreenButton>
                <GreenButton onClick={resetUpload}>Reset</GreenButton>
              </Box>

              {isLoading && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                    Processing users...
                  </Typography>
                  <LinearProgress
                    sx={{
                      backgroundColor: "#333",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#A04AD4",
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {uploadResult && (
        <Card
          sx={{
            backgroundColor: theme.palette.text.secondary,
            borderRadius: 0,
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
              Upload Results
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={3}>
                <Chip
                  icon={<CheckCircle sx={{ color: "white" }} />}
                  label={`Total: ${uploadResult.totalRows}`}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: "white",
                    borderRadius: 0,
                  }}
                />
              </Grid>
              <Grid size={3}>
                <Chip
                  icon={<CheckCircle />}
                  label={`Success: ${uploadResult.successfullyCreated}`}
                  color="success"
                  sx={{ borderRadius: 0 }}
                />
              </Grid>
              <Grid size={3}>
                <Chip
                  icon={<ErrorIcon />}
                  label={`Errors: ${uploadResult.errors?.length || 0}`}
                  sx={{ borderRadius: 0 }}
                  color="error"
                />
              </Grid>
              <Grid size={3}>
                <Chip
                  icon={<Warning />}
                  label={`Duplicates: ${uploadResult.duplicates?.length || 0}`}
                  sx={{ borderRadius: 0 }}
                  color="warning"
                />
              </Grid>
            </Grid>

            {uploadResult.success ? (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 0 }}>
                Successfully uploaded {uploadResult.successfullyCreated} users!
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
                Upload completed with issues. Please review the details below.
              </Alert>
            )}

            {/* Errors Section */}
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowErrors(!showErrors)}
                >
                  <Typography variant="h4" sx={{ color: "#ff4444", mr: 1 }}>
                    Errors ({uploadResult.errors.length})
                  </Typography>
                  <IconButton size="small" sx={{ color: "#ff4444" }}>
                    {showErrors ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={showErrors}>
                  <List dense>
                    {uploadResult.errors.map((error, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          backgroundColor: "#2a1a1a",
                          mb: 1,
                          borderRadius: 0,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ color: "#ff4444" }}
                            >
                              Row {error.row}: {error.error}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "#ccc" }}
                            >
                              {error.data?.name} - {error.data?.companyMail}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )}

            {/* Duplicates Section */}
            {uploadResult.duplicates && uploadResult.duplicates.length > 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowDuplicates(!showDuplicates)}
                >
                  <Typography variant="h4" sx={{ color: "#ff9800", mr: 1 }}>
                    Duplicates ({uploadResult.duplicates.length})
                  </Typography>
                  <IconButton size="small" sx={{ color: "#ff9800" }}>
                    {showDuplicates ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={showDuplicates}>
                  <List dense>
                    {uploadResult.duplicates.map((duplicate, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          backgroundColor: "#2a1a1a",
                          mb: 1,
                          borderRadius: 0,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ color: "#ff9800" }}
                            >
                              Row {duplicate.row}: User already exists
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "#ccc" }}
                            >
                              {duplicate.data?.name} -{" "}
                              {duplicate.data?.companyMail}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )}

            <Divider sx={{ my: 2, backgroundColor: "white" }} />

            <GreenButton onClick={resetUpload}>Upload Another File</GreenButton>
          </CardContent>
        </Card>
      )}
      <Box display={"flex"} justifyContent={"flex-end"} mb={2} mt={4}>
        <GreenButton onClick={downloadSampleTemplate}>
          Download Sample Template
        </GreenButton>
      </Box>
    </Box>
  );
};

export default BulkUserUpload;
