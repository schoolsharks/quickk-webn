import React, { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import GlobalTable, {
  ActionButton,
  TableColumn,
} from "../../../components/ui/GlobalTable";
import { useDeleteUserByIdMutation } from "../service/adminApi";

// User Data Interface
export interface UserData {
  _id?: string;
  name: string;
  companyMail: string;
  contact: string;
  learningStreak: number;
  chapter?: string;
  businessName?: string;
  instagram?: string;
  facebook?: string;
  businessCategory?: string;
  specialisation?: string;
  updatedAt?: string;
}

export interface UserTableProps {
  data: UserData[];
  isLoading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ data, isLoading = false }) => {
  const [DeleteUserById] = useDeleteUserByIdMutation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedUserName, setDeletedUserName] = useState("");

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Transform backend data to table format
  const transformedData = data?.map((user, index) => {
    return {
      id: index,
      name: user.name,
      companyMail: user.companyMail,
      contact: user.contact,
      learningStreak: user.learningStreak,
      activityStatus: user.learningStreak > 0,
      chapter: user.chapter || "",
      businessName: user.businessName || "",
      businessCategory: user.businessCategory || "",
      specialisation: user.specialisation || "",
      originalData: user,
    };
  });

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: "name",
      label: "Name",
      minWidth: 150,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "companyMail",
      label: "Company Email",
      minWidth: 200,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      minWidth: 120,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "businessName",
      label: "Business Name",
      minWidth: 150,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value || "-"}
        </Typography>
      ),
    },
    {
      id: "businessCategory",
      label: "Category",
      minWidth: 130,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value || "-"}
        </Typography>
      ),
    },
    {
      id: "chapter",
      label: "Chapter",
      minWidth: 120,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value || "-"}
        </Typography>
      ),
    },
    {
      id: "learningStreak",
      label: "Daily Streak",
      minWidth: 120,
      align: "center",
      format: (value: number) => (
        <Typography
          sx={{
            // color: value > 0 ? "#10B981" : "#9CA3AF",
            fontSize: "14px",
            fontWeight: value > 0 ? "bold" : "normal",
          }}
        >
          {value} days
        </Typography>
      ),
    },
    {
      id: "activityStatus",
      label: "Status",
      minWidth: 80,
      align: "center",
      format: (value: boolean) => (
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: value ? "#10B981" : "#EF4444",
            margin: "0 auto",
          }}
        />
      ),
    },
  ];

  const actionButtons: ActionButton[] = [
    {
      icon: <EditIcon />,
      label: "Edit",
      color: "info",
      onClick: (row) => {
        navigate(`/admin/user/${row.originalData._id}`);
      },
    },
    {
      icon: <DeleteIcon />,
      label: "Delete",
      color: "error",
      onClick: async (row) => {
        try {
          await DeleteUserById(row?.originalData._id).unwrap();
          setDeletedUserName(row?.originalData.name || "User");
          setSnackbarOpen(true);
        } catch (error) {
          console.log("Error deleting user:", error);
        }
      },
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ background: "white", p: "24px 28px" }}>
        <Typography sx={{ color: "black" }}>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <>
      <GlobalTable
        title="Webn Members Directory"
        columns={columns}
        data={transformedData}
        showActions={true}
        maxHeight={600}
        actionButtons={actionButtons}
      />
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {deletedUserName} has been deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserTable;
