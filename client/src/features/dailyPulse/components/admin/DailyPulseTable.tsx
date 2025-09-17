import React from "react";
import { Box, Typography } from "@mui/material";
import GlobalTable, {
  ActionButton,
  TableColumn,
} from "../../../../components/ui/GlobalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import {
  useArchievedailyPulseByIdMutation,
  useDeleteDailyPulseByIdMutation,
} from "../../dailyPulseApi";
import ArchiveIcon from "@mui/icons-material/Archive";

// Daily Pulse Table Component
export interface DailyPulseData {
  publishOn: string;
  status: "Published" | "Draft" | "Archived";
  pulses: Array<{
    refId: string;
    type: "Question" | "infoCard";
    responseCount?: number;
    feedbackCount?: number;
  }>;
}

export interface DailyPulseTableProps {
  data: DailyPulseData[];
  isLoading?: boolean;
}

const DailyPulseTable: React.FC<DailyPulseTableProps> = ({
  data,
  isLoading = false,
}) => {
  const [DeleteDailyPulseById] = useDeleteDailyPulseByIdMutation();
  const [ArchievedailyPulseById] = useArchievedailyPulseByIdMutation();

  // Transform backend data to table format
  const transformedData = data?.map((item, index) => {
    // Calculate total responses across all pulses
    const totalResponses = item.pulses.reduce((total, pulse) => {
      if (pulse.type === "Question" && pulse.responseCount) {
        return total + pulse.responseCount;
      }
      if (pulse.type === "infoCard" && pulse.feedbackCount) {
        return total + pulse.feedbackCount;
      }
      return total;
    }, 0);

    // Format date
    const publishDate = new Date(item.publishOn).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return {
      id: index,
      status: item.status,
      publishDate,
      responses: totalResponses,
      originalData: item,
    };
  });

  // Define table columns matching the image
  const columns: TableColumn[] = [
    {
      id: "publishDate",
      label: "Publish on",
      minWidth: 150,
      align: "left",
      format: (value: string) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
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
        // <Chip
        //   label={value}
        //   sx={{
        //     backgroundColor: "transparent",
        //     fontWeight: "bold",
        //     fontSize: "13px",
        //     height: 24,
        //   }}
        //   size="small"
        // />
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
        </Typography>
      ),
    },
    {
      id: "responses",
      label: "Response",
      minWidth: 100,
      align: "left",
      format: (value: number) => (
        <Typography sx={{ color: "black", fontSize: "14px" }}>
          {value}
        </Typography>
      ),
    },
  ];

  const navigate = useNavigate();

  const actionButtons: ActionButton[] = [
    {
      icon: <ArchiveIcon />,
      label: "Archive",
      color: "info",
      onClick: async (row) => {
        try {
          console.log(row.originalData._id);
          await ArchievedailyPulseById(row.originalData._id).unwrap();
        } catch (error) {
          console.log(error);
        }
      },
    },
    {
      icon: <EditIcon />,
      label: "Edit",
      color: "info",
      onClick: (row) => {
        navigate(`/admin/learnings/dailyPulse/review/${row.originalData._id}`);
      },
    },
    {
      icon: <DeleteIcon />,
      label: "Delete",
      color: "error",
      onClick: async (row) => {
        try {
          await DeleteDailyPulseById(row?.originalData._id).unwrap();
        } catch (error) {
          console.log("Error deleting daily pulse :", error);
        }
      },
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ background: "black", p: "24px 28px" }}>
        <Typography sx={{ color: "white" }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <GlobalTable
      title="Daily Pulse"
      columns={columns}
      data={transformedData}
      showActions={true}
      maxHeight={600}
      actionButtons={actionButtons}
    />
  );
};

export default DailyPulseTable;
