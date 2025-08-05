import React from "react";
import { Box, Typography } from "@mui/material";
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
}

export interface UserTableProps {
  data: UserData[];
  isLoading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ data, isLoading = false }) => {
  const [DeleteUserById] = useDeleteUserByIdMutation();
  const navigate = useNavigate();

  // Transform backend data to table format
  const transformedData = data?.map((user, index) => {
    return {
      id: index,
      name: user.name,
      companyMail: user.companyMail,
      contact: user.contact,
      learningStreak: user.learningStreak,
      originalData: user,
    };
  });

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: "name",
      label: "Name",
      minWidth: 180,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "white", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "companyMail",
      label: "Company Email",
      minWidth: 220,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "white", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      minWidth: 140,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "white", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "learningStreak",
      label: "Learning Streak",
      minWidth: 120,
      align: "center",
      format: (value: number) => (
        <Typography
          sx={{
            color: value > 0 ? "#10B981" : "#9CA3AF",
            fontSize: "14px",
            fontWeight: value > 0 ? "bold" : "normal",
          }}
        >
          {value} days
        </Typography>
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
        } catch (error) {
          console.log("Error deleting user:", error);
        }
      },
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ background: "black", p: "24px 28px" }}>
        <Typography sx={{ color: "white" }}>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <GlobalTable
      title="Users"
      columns={columns}
      data={transformedData}
      showActions={true}
      maxHeight={600}
      actionButtons={actionButtons}
    />
  );
};

export default UserTable;
