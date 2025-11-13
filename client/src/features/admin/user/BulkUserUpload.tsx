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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  ExpandMore,
  ExpandLess,
  SwapHoriz,
  Delete,
  SkipNext,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  useBulkUploadUsersMutation,
  useAddEditUserMutation,
  useDeleteUserByIdMutation,
} from "../service/adminApi";
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

type DuplicateAction = "replace" | "delete" | "skip";

interface DuplicateUser {
  row: number;
  data: UserData;
  existingUser: {
    _id: string;
    name: string;
    companyMail: string;
  };
  action?: DuplicateAction;
}

interface UploadResult {
  success: boolean;
  totalRows: number;
  successfullyCreated: number;
  errors?: Array<{
    row: number;
    data: UserData;
    error: string;
    action?: DuplicateAction; // Optional action field for duplicate processing errors
  }>;
  duplicates?: DuplicateUser[];
}

interface DuplicateProcessingResult {
  success: boolean;
  processed: number;
  errors: Array<{
    row: number;
    data: UserData;
    error: string;
    action: DuplicateAction;
  }>;
}

const BulkUserUpload: React.FC = () => {
  const [bulkUploadUsers, { isLoading }] = useBulkUploadUsersMutation();
  const [addEditUser] = useAddEditUserMutation();
  const [deleteUserById] = useDeleteUserByIdMutation();

  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<UserData[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);

  // Duplicate handling states
  const [duplicatesDialogOpen, setDuplicatesDialogOpen] = useState(false);
  const [duplicatesWithActions, setDuplicatesWithActions] = useState<
    DuplicateUser[]
  >([]);
  const [isProcessingDuplicates, setIsProcessingDuplicates] = useState(false);
  const [duplicateProcessingResult, setDuplicateProcessingResult] =
    useState<DuplicateProcessingResult | null>(null);

  // Sample template data
  const sampleData = [
    {
      Name: "John Doe",
      "Business Name": "Doe Enterprises",
      "Company Email": "john.doe@company.com",
      Contact: "9876543210",
      "Business Category": "Technology",
      Specialisation: "Software Development",
      Chapter: "Mumbai Chapter",
      Instagram: "@doe_enterprises",
      Facebook: "fb.com/doe.enterprises",
      Address: "123 Main Street, City, State, 12345",
    },
    {
      Name: "Jane Smith",
      "Business Name": "Smith Solutions",
      "Company Email": "jane.smith@company.com",
      Contact: "9876543211",
      "Business Category": "Consulting",
      Specialisation: "Business Strategy",
      Chapter: "Delhi Chapter",
      Instagram: "@smith_solutions",
      Facebook: "fb.com/smith.solutions",
      Address: "456 Oak Avenue, City, State, 12346",
    },
  ];

  // Download sample template
  const downloadSampleTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "webn_new_members_upload.xlsx");
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
        if (!emailPattern.test(row["Company Email"].trim())) {
          errors.push(`Row ${rowNumber}: Invalid email format`);
        }
      }

      if (row.Contact && !/^\d{10}$/.test(row.Contact)) {
        errors.push(`Row ${rowNumber}: Contact must be exactly 10 digits`);
      }

      // // Validate Instagram format (should start with @)
      // if (
      //   row.Instagram &&
      //   row.Instagram.trim() &&
      //   !row.Instagram.trim().startsWith("@")
      // ) {
      //   errors.push(`Row ${rowNumber}: Instagram handle should start with @`);
      // }

      // // Validate Facebook URL format
      // if (
      //   row.Facebook &&
      //   row.Facebook.trim() &&
      //   !row.Facebook.includes("facebook.com") &&
      //   !row.Facebook.includes("fb.com")
      // ) {
      //   errors.push(
      //     `Row ${rowNumber}: Facebook should be a valid Facebook URL`
      //   );
      // }
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
          contact: String(row.Contact)?.trim() || "",
          address: row.Address?.trim() || "",
          chapter: row.Chapter?.trim() || "",
          businessName: row["Business Name"]?.trim() || "",
          instagram: row.Instagram?.trim() || "",
          facebook: row.Facebook?.trim() || "",
          businessCategory: row["Business Category"]?.trim() || "",
          specialisation: row.Specialisation?.trim() || "",
          webnClubMember: true,
        }));

        setParsedData(transformedData);
        setValidationErrors([]);
        setUploadResult(null);
      } catch (error) {
        console.log("Error",error)
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

      // Check if there are duplicates that need user decision
      if (safeResult.duplicates && safeResult.duplicates.length > 0) {
        setDuplicatesWithActions(
          safeResult.duplicates.map((dup: DuplicateUser) => ({
            ...dup,
            action: undefined,
          }))
        );
        setDuplicatesDialogOpen(true);
        // Store the initial result for later processing
        setUploadResult(safeResult);
      } else {
        setUploadResult(safeResult);
      }
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

  // Handle duplicate action selection
  const handleDuplicateAction = (index: number, action: DuplicateAction) => {
    setDuplicatesWithActions((prev) =>
      prev.map((dup, i) => (i === index ? { ...dup, action } : dup))
    );
  };

  // Process duplicates based on user actions
  const processDuplicates = async () => {
    setIsProcessingDuplicates(true);
    setDuplicatesDialogOpen(false);

    const processResults: DuplicateProcessingResult = {
      success: true,
      processed: 0,
      errors: [],
    };

    try {
      for (const duplicate of duplicatesWithActions) {
        if (!duplicate.action) continue;

        try {
          switch (duplicate.action) {
            case "replace":
              // Update the existing user with new data
              await addEditUser({
                userId: duplicate.existingUser._id,
                ...duplicate.data,
              }).unwrap();
              processResults.processed++;
              break;

            case "delete":
              // Delete the existing user first, then create new one
              await deleteUserById(duplicate.existingUser._id).unwrap();
              // Create new user by including it in a new bulk upload
              await bulkUploadUsers([duplicate.data]).unwrap();
              processResults.processed++;
              break;

            case "skip":
              // Do nothing, just count as processed
              processResults.processed++;
              break;
          }
        } catch (error: any) {
          processResults.errors.push({
            row: duplicate.row,
            data: duplicate.data,
            error: error?.data?.message || `Failed to ${duplicate.action} user`,
            action: duplicate.action,
          });
          processResults.success = false;
        }
      }

      setDuplicateProcessingResult(processResults);

      // Update upload result to reflect final state
      const originalResult = uploadResult || {
        success: false,
        totalRows: parsedData.length,
        successfullyCreated: 0,
        errors: [],
        duplicates: duplicatesWithActions,
      };

      setUploadResult({
        ...originalResult,
        successfullyCreated:
          originalResult.successfullyCreated + processResults.processed,
        duplicates: [], // Clear duplicates as they're now processed
        errors: [...(originalResult.errors || []), ...processResults.errors],
        success:
          originalResult.successfullyCreated + processResults.processed > 0 &&
          processResults.errors.length === 0,
      });
    } catch (error) {
      console.error("Error processing duplicates:", error);
    } finally {
      setIsProcessingDuplicates(false);
    }
  };

  // Cancel duplicate processing
  const cancelDuplicateProcessing = () => {
    setDuplicatesDialogOpen(false);
    // Show original result with duplicates
    const safeResult = {
      success: uploadResult?.success || false,
      totalRows: uploadResult?.totalRows || parsedData.length,
      successfullyCreated: uploadResult?.successfullyCreated || 0,
      errors: uploadResult?.errors || [],
      duplicates: duplicatesWithActions,
    };
    setUploadResult(safeResult);
  };

  const resetUpload = () => {
    setParsedData([]);
    setValidationErrors([]);
    setUploadResult(null);
    setShowErrors(false);
    setShowDuplicates(false);
    setDuplicatesDialogOpen(false);
    setDuplicatesWithActions([]);
    setDuplicateProcessingResult(null);
  };
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* Duplicate Handling Dialog */}
      <Dialog
        open={duplicatesDialogOpen}
        onClose={() => {}}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 0,
            backgroundColor: theme.palette.text.secondary,
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>
          <Typography variant="h5">
            Handle Duplicate Users ({duplicatesWithActions.length})
          </Typography>
          <Typography variant="body2" sx={{ color: "#ccc", mt: 1 }}>
            The following users already exist in the system. Choose an action
            for each:
          </Typography>
        </DialogTitle>

        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#2a2a2a", borderRadius: 0 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Row
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Existing User
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {duplicatesWithActions.map((duplicate, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "white" }}>
                      {duplicate.row}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {duplicate.data.name}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {duplicate.data.companyMail}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {duplicate.existingUser.name} (
                      {duplicate.existingUser.companyMail})
                    </TableCell>
                    <TableCell>
                      <ButtonGroup
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 0,
                          "& .MuiButton-root": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                            minWidth: "80px",
                          },
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleDuplicateAction(index, "replace")
                          }
                          startIcon={<SwapHoriz />}
                          variant={
                            duplicate.action === "replace"
                              ? "contained"
                              : "outlined"
                          }
                          sx={{
                            borderRadius: 0,
                            backgroundColor:
                              duplicate.action === "replace"
                                ? "#4caf50"
                                : "transparent",
                            "&:hover": {
                              backgroundColor: "#4caf50",
                            },
                          }}
                        >
                          Replace
                        </Button>
                        <Button
                          onClick={() => handleDuplicateAction(index, "delete")}
                          startIcon={<Delete />}
                          variant={
                            duplicate.action === "delete"
                              ? "contained"
                              : "outlined"
                          }
                          sx={{
                            backgroundColor:
                              duplicate.action === "delete"
                                ? "#f44336"
                                : "transparent",
                            "&:hover": {
                              backgroundColor: "#f44336",
                            },
                          }}
                        >
                          Delete & Create
                        </Button>
                        <Button
                          onClick={() => handleDuplicateAction(index, "skip")}
                          startIcon={<SkipNext />}
                          variant={
                            duplicate.action === "skip"
                              ? "contained"
                              : "outlined"
                          }
                          sx={{
                            borderRadius: 0,
                            backgroundColor:
                              duplicate.action === "skip"
                                ? "#ff9800"
                                : "transparent",
                            "&:hover": {
                              backgroundColor: "#ff9800",
                            },
                          }}
                        >
                          Skip
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{ mt: 2, p: 2, backgroundColor: "#1a1a1a", borderRadius: 0 }}
          >
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
              <strong>Actions Explained:</strong>
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#ccc", display: "block" }}
            >
              • <strong>Replace:</strong> Update the existing user with new data
              from Excel
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#ccc", display: "block" }}
            >
              • <strong>Delete & Create:</strong> Delete the existing user and
              create a new one with Excel data
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#ccc", display: "block" }}
            >
              • <strong>Skip:</strong> Keep the existing user unchanged, ignore
              Excel row
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={cancelDuplicateProcessing} sx={{ color: "#ccc" }}>
            Cancel
          </Button>
          <GreenButton
            onClick={processDuplicates}
            disabled={
              isProcessingDuplicates ||
              !duplicatesWithActions.every((dup) => dup.action)
            }
          >
            {isProcessingDuplicates ? "Processing..." : "Process Duplicates"}
          </GreenButton>
        </DialogActions>
      </Dialog>

      {/* Processing Dialog */}
      <Dialog
        open={isProcessingDuplicates}
        sx={{
          borderRadius: 0,
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.text.secondary,
            color: "white",
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <LinearProgress
            sx={{
              mb: 2,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#A04AD4",
              },
            }}
          />
          <Typography variant="h6" sx={{ color: "white" }}>
            Processing duplicate actions...
          </Typography>
          <Typography variant="body2" sx={{ color: "#ccc", mt: 1 }}>
            Please wait while we handle the duplicate users.
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Upload Section */}
      <Card
        sx={{
          mb: 3,
          backgroundColor:"#F0D7FF",
          borderRadius: 0,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: "black", mb: 2 }}>
            Upload excel file
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed black",
              borderRadius: 0,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragActive
                ? "rgba(160, 74, 212, 0.1)"
                : "transparent",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: "black", mb: 2 }} />
            <Typography variant="body1" sx={{ color: "black", mb: 1 }}>
              {isDragActive
                ? "Drop the Excel file here..."
                : "Drag & drop an Excel file here, or click to select"}
            </Typography>
            <Typography variant="body2" sx={{ color: "black" }}>
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

            {/* Show duplicate processing results if available */}
            {duplicateProcessingResult &&
              duplicateProcessingResult.processed > 0 && (
                <Alert
                  severity={
                    duplicateProcessingResult.success &&
                    duplicateProcessingResult.errors.length === 0
                      ? "success"
                      : duplicateProcessingResult.errors.length > 0
                      ? "warning"
                      : "info"
                  }
                  sx={{ mb: 2, borderRadius: 0 }}
                >
                  <Typography variant="body2">
                    {duplicateProcessingResult.errors.length === 0
                      ? `✓ Successfully processed ${duplicateProcessingResult.processed} duplicate users.`
                      : `Processed ${duplicateProcessingResult.processed} duplicate users. ${duplicateProcessingResult.errors.length} failed to process.`}
                  </Typography>
                </Alert>
              )}

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
                {duplicateProcessingResult
                  ? `Successfully processed all users! ${uploadResult.successfullyCreated} users uploaded/updated.`
                  : `Successfully uploaded ${uploadResult.successfullyCreated} users!`}
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
                {duplicateProcessingResult &&
                duplicateProcessingResult.errors.length > 0
                  ? `Processing completed with issues. ${duplicateProcessingResult.errors.length} duplicate actions failed.`
                  : "Upload completed with issues. Please review the details below."}
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
                              {error.action &&
                                ` (${error.action} action failed)`}
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

            <GreenButton onClick={resetUpload}>
              {duplicateProcessingResult
                ? "Process Another File"
                : "Upload Another File"}
            </GreenButton>
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
