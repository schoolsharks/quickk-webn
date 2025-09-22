import React from "react";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import {
  //   Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import GlobalTable, {
  ActionButton,
  TableColumn,
} from "../../../components/ui/GlobalTable";

interface LearningOverviewData {
  module: string;
  users: number;
  engagement: string;
  averageScore: string;
}

// interface ParticipationData {
//   category: string;
//   audience: number;
//   managers: number;
//   executives: number;
// }

// interface ScorerData {
//   name: string;
//   percentage: string;
// }

const DashboardTables: React.FC = () => {
  // Learning Overview Data
  const learningData: LearningOverviewData[] = [
    {
      module: "POSH",
      users: 0,
      engagement: "0%",
      averageScore: "0%",
    },
    {
      module: "Digital Literacy",
      users: 0,
      engagement: "0%",
      averageScore: "0%",
    },
    {
      module: "Module 5",
      users: 0,
      engagement: "0%",
      averageScore: "0%",
    },
    {
      module: "Entrepreneurship",
      users: 0,
      engagement: "0%",
      averageScore: "0%",
    },
    {
      module: "Scam Awareness",
      users: 0,
      engagement: "0%",
      averageScore: "0%",
    },
    {
      module: "Soft Skills",
      users: 0,
      engagement: "0%",
      averageScore: "0%",
    },
    {
      module: "Entrepreneurship",
      users: 700,
      engagement: "62%",
      averageScore: "60%",
      durationActive: "2 Months",
    },
    {
      module: "Scam Awareness",
      users: 3456,
      engagement: "48%",
      averageScore: "10%",
      durationActive: "1 Month",
    },
    {
      module: "Soft Skills",
      users: 1245,
      engagement: "20%",
      averageScore: "100%",
      durationActive: "4 Months",
    },
  ];

  // Participation Data
  // const participationData: ParticipationData[] = [
  //   { category: "Total users", audience: 1520, managers: 300, executives: 200 },
  //   {
  //     category: "Inactive last 7 days",
  //     audience: 35,
  //     managers: 157,
  //     executives: 240,
  //   },
  //   {
  //     category: "Inactive last 15 days",
  //     audience: 5,
  //     managers: 50,
  //     executives: 201,
  //   },
  //   { category: "Below 80%", audience: 10, managers: 54, executives: 100 },
  //   { category: "Reattempted", audience: 12, managers: 40, executives: 10 },
  // ];

  // // Top Scorers Data
  // const topScorersData: ScorerData[] = [
  //   { name: "Ujjwal Kwatra", percentage: "82%" },
  //   { name: "Vidhi chawla", percentage: "74%" },
  //   { name: "Aditi Sharma", percentage: "72%" },
  //   { name: "Raj Mishra", percentage: "70%" },
  //   { name: "Hardik Kapoor", percentage: "70%" },
  // ];

  // // Below Average Scorers Data
  // const belowAverageScorersData: ScorerData[] = [
  //   { name: "Ujjwal Kwatra", percentage: "22%" },
  //   { name: "Vidhi chawla", percentage: "24%" },
  //   { name: "Aditi Sharma", percentage: "21%" },
  //   { name: "Raj Mishra", percentage: "18%" },
  //   { name: "Hardik Kapoor", percentage: "05%" },
  // ];

  // Column definitions
  const learningColumns: TableColumn[] = [
    { id: "module", label: "MODULE", minWidth: 170 },
    { id: "users", label: "USERS", minWidth: 100, align: "center" },
    {
      id: "engagement",
      label: "ENGAGEMENTS",
      minWidth: 120,
      align: "center",
      format: (value: string) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box width={"50%"}>
            <Typography textAlign={"left"}>{value}</Typography>
            <LinearProgress
              variant="determinate"
              value={parseInt(value)}
              sx={{
                flex: "1",
                height: 3,
              }}
              color={"primary"}
            />
          </Box>
        </Box>
      ),
    },
    {
      id: "averageScore",
      label: "AVERAGE SCORE",
      minWidth: 140,
      align: "center",
      format: (value: string) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            // justifyContent: "flex-start",
          }}
        >
          <Box width={"40%"}>
            <Typography textAlign={"left"}>{value}</Typography>
            <LinearProgress
              variant="determinate"
              value={parseInt(value)}
              sx={{
                height: 3,
              }}
              color={"primary"}
            />
          </Box>
        </Box>
      ),
    },
  ];

  // const participationColumns: TableColumn[] = [
  //   { id: "category", label: "CATEGORY", minWidth: 200 },
  //   { id: "audience", label: "AUDIENCE", minWidth: 100, align: "center" },
  //   { id: "managers", label: "MANAGERS", minWidth: 100, align: "center" },
  //   { id: "executives", label: "EXECUTIVES", minWidth: 100, align: "center" },
  // ];

  // const scorerColumns: TableColumn[] = [
  //   { id: "name", label: "NAME", minWidth: 150 },
  //   {
  //     id: "percentage",
  //     label: "PERCENTAGE",
  //     minWidth: 120,
  //     align: "center",
  //     //   format: (value: string) => (
  //     //     <Chip
  //     //       label={value}
  //     //       color={parseInt(value) > 50 ? 'success' : 'error'}
  //     //       variant="filled"
  //     //       size="small"
  //     //     />
  //     //   ),
  //   },
  // ];

  // Action buttons for learning overview
  const learningActionButtons: ActionButton[] = [
    {
      icon: <ViewIcon />,
      label: "View Details",
      onClick: (row) => console.log("View details for:", row),
      color: "primary",
    },
    {
      icon: <EditIcon />,
      label: "Edit Module",
      onClick: (row) => console.log("Edit module:", row),
      color: "secondary",
    },
    {
      icon: <DeleteIcon />,
      label: "Delete Module",
      onClick: (row) => console.log("Delete module:", row),
      color: "error",
    },
  ];

  // Action buttons for scorers
  // const scorerActionButtons: ActionButton[] = [
  //   {
  //     icon: <ViewIcon />,
  //     label: "View Profile",
  //     onClick: (row) => console.log("View profile for:", row),
  //     color: "primary",
  //   },
  //   {
  //     icon: <EditIcon />,
  //     label: "Edit User",
  //     onClick: (row) => console.log("Edit user:", row),
  //     color: "secondary",
  //   },
  // ];

  const handleDownload = (tableName: string) => {
    console.log(`Downloading ${tableName} data...`);
    // Implement download logic here
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Grid container spacing={3} height={"100%"}>
        {/* Learning Overview Table */}
        <Grid size={12} height={"100%"}>
          <GlobalTable
            title="Modules Overview"
            columns={learningColumns}
            data={learningData}
            showActions={false}
            actionButtons={learningActionButtons}
            showDownload={true}
            onDownload={() => handleDownload("Learning Overview")}
            dense={false}
          />
        </Grid>

        {/* Participation Table */}
        {/* <Grid size={12}>
          <GlobalTable
            title="Participation"
            columns={participationColumns}
            data={participationData}
            showActions={false}
            showDownload={true}
            onDownload={() => handleDownload("Participation")}
            dense={false}
          />
        </Grid> */}

        {/* Top Scorers and Below Average Scorers */}
        {/* <Grid size={6}>
          <GlobalTable
            title="Top Scorers"
            columns={scorerColumns}
            data={topScorersData}
            showActions={false}
            actionButtons={scorerActionButtons}
            showDownload={true}
            onDownload={() => handleDownload("Top Scorers")}
            dense={false}
          />
        </Grid> */}

        {/* <Grid size={6}>
          <GlobalTable
            title="Below Average Scorers"
            columns={scorerColumns}
            data={belowAverageScorersData}
            showActions={false}
            actionButtons={scorerActionButtons}
            showDownload={true}
            onDownload={() => handleDownload("Below Average Scorers")}
            dense={false}
          />
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default DashboardTables;
