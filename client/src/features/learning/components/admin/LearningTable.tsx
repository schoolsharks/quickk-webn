import React from "react";
import { Chip, Typography } from "@mui/material";
import GlobalTable, {
  ActionButton,
  TableColumn,
} from "../../../../components/ui/GlobalTable";
import Loader from "../../../../components/ui/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import {
  useArchieveLearningByIdMutation,
  useDeleteLearningByIdMutation,
} from "../../service/learningApi";

// Learning Table Component
export interface LearningData {
  name: string;
  users: number;
  modules: number;
  status: "Published" | "Draft" | "Archived";
}

export interface LearningTableProps {
  data: LearningData[];
  isLoading?: boolean;
}

const LearningTable: React.FC<LearningTableProps> = ({
  data,
  isLoading = false,
}) => {
  const [DeleteLearningById] = useDeleteLearningByIdMutation();
  const [ArchieveLearningById] = useArchieveLearningByIdMutation();

  const navigate = useNavigate();
  // Define table columns matching the image
  const columns: TableColumn[] = [
    {
      id: "name",
      label: "Name",
      minWidth: 150,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ fontSize: "14px", textDecoration: "underline" }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      align: "left",
      format: (value: string) => (
        <Chip
          label={value}
          sx={{
            bgcolor:
              value === "published"
                ? "primary.main"
                : value === "drafts"
                ? "#64748b"
                : "#FFF",
            color: value === "drafts" ? "white" : "black",
            fontWeight: "bold",
            fontSize: "13px",
            height: 24,
          }}
          size="small"
        />
      ),
    },
    {
      id: "users",
      label: "Users",
      minWidth: 100,
      align: "left",
      format: (value: number) => (
        <Typography sx={{ fontSize: "14px" }}>{value}</Typography>
      ),
    },
    {
      id: "modules",
      label: "Modules",
      minWidth: 100,
      sortable: true,
      align: "left",
      format: (value: number) => (
        <Typography sx={{ fontSize: "14px" }}>{value}</Typography>
      ),
    },
  ];

  const actionButtons: ActionButton[] = [
    {
      icon: <ArchiveIcon />,
      label: "Archive",
      color: "info",
      onClick: async (row) => {
        try {
          console.log(row._id);
          await ArchieveLearningById(row._id).unwrap();
          // Show success snackbar
          window.dispatchEvent(
            new CustomEvent("showSnackbar", {
              detail: {
                message: "Learning archieved successfully",
                severity: "success",
              },
            })
          );
        } catch (error) {
          // Show error snackbar
          window.dispatchEvent(
            new CustomEvent("showSnackbar", {
              detail: {
                message: "Failed to archive learning",
                severity: "error",
              },
            })
          );
        }
      },
    },
    {
      icon: <EditIcon />,
      label: "Edit",
      color: "info",
      onClick: (row) => {
        navigate(`/admin/learnings/create/${row._id}`);
      },
    },
    {
      icon: <DeleteIcon />,
      label: "Delete",
      color: "error",
      onClick: async (row) => {
        try {
          console.log(row._id);
          await DeleteLearningById(row._id).unwrap();
          // Show success snackbar
          window.dispatchEvent(
            new CustomEvent("showSnackbar", {
              detail: {
                message: "Learning deleted successfully",
                severity: "success",
              },
            })
          );
        } catch (error) {
          // Show error snackbar
          window.dispatchEvent(
            new CustomEvent("showSnackbar", {
              detail: {
                message: "Failed to delete learning",
                severity: "error",
              },
            })
          );
        }
      },
    },
  ];

  // Pass action buttons to GlobalTable if supported

  if (isLoading) {
    return <Loader />;
  }

  return (
    <GlobalTable
      title="List"
      columns={columns}
      data={data}
      showDownload={false}
      actionButtons={actionButtons}
      showActions={true}
      maxHeight={600}
    />
  );
};

export default LearningTable;
