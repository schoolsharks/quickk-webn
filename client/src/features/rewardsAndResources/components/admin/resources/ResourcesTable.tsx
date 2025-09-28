import React, { useState } from "react";
import { Box, Typography, Chip, Snackbar, Alert } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GlobalTable, {
  TableColumn,
  ActionButton,
} from "../../../../../components/ui/GlobalTable";
import HeadingSubheading from "../../../../../components/ui/HeadingSubheading";
import { useDeleteResourceMutation } from "../../../rewardsAndResourcesApi";

export interface ResourceData {
  _id: string;
  heading: string;
  subHeading: string;
  companyName: string;
  type: "SERVICE" | "PRODUCT";
  expiryDate: string;
  status: "ACTIVE" | "DRAFT";
  stars: number;
  totalRedeemed: number;
}

export interface ResourcesTableProps {
  data: ResourceData[];
  isLoading?: boolean;
}

const ResourcesTable: React.FC<ResourcesTableProps> = ({
  data,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [deleteResource] = useDeleteResourceMutation();
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEdit = (resourceId: string) => {
    navigate(`/admin/resources/edit/${resourceId}`);
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteResource(resourceId).unwrap();
      showSnackbar("Resource deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting resource:", error);
      showSnackbar("Failed to delete resource. Please try again.", "error");
    }
  };

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: "titleAndOffer",
      label: "Title & Offer",
      minWidth: 250,
      render: (_, row: ResourceData) => (
        <HeadingSubheading heading={row.heading} subheading={row.subHeading} />
      ),
    },
    {
      id: "companyName",
      label: "Company",
      minWidth: 140,
      render: (value: string) => (
        <Typography variant="body2" color="black">
          {value}
        </Typography>
      ),
    },
    {
      id: "type",
      label: "Type",
      minWidth: 100,
      render: (value: string) => (
        <Typography variant="body2" color="black">
          {value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
        </Typography>
      ),
    },
    {
      id: "expiryDate",
      label: "Expiry Date",
      minWidth: 120,
      render: (value: string) => (
        <Typography variant="body2" color="black">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: "stars",
      label: "Stars",
      align: "center",
      minWidth: 80,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={600} color="black">
          {value}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      render: (value: string) => (
        <Chip
          label={value
            .toLocaleLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase())}
          size="small"
          color={value === "ACTIVE" ? "success" : "default"}
          sx={{
            backgroundColor: value === "ACTIVE" ? "#CD7BFF4D" : "#D9D9D9",
            color: value === "ACTIVE" ? "primary.main" : "white",
            fontWeight: 500,
            borderRadius: "0",
          }}
        />
      ),
    },
    {
      id: "totalRedeemed",
      label: "Redeemed",
      align: "center",
      minWidth: 100,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={600} color="black">
          {value}
        </Typography>
      ),
    },
  ];

  // Define action buttons for the table
  const actionButtons: ActionButton[] = [
    {
      icon: <EditIcon />,
      label: "Edit",
      color: "info",
      onClick: (row: ResourceData) => {
        handleEdit(row._id);
      },
    },
    {
      icon: <DeleteIcon />,
      label: "Delete",
      color: "error",
      onClick: (row: ResourceData) => {
        handleDelete(row._id);
      },
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
          bgcolor: "white",
          border: "1px solid #A04AD4",
          borderRadius: "8px",
        }}
      >
        <Typography sx={{ color: "black" }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <GlobalTable
        title="List"
        columns={columns}
        data={data}
        showActions={true}
        actionButtons={actionButtons}
        maxHeight={600}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResourcesTable;
