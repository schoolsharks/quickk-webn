import React, { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GlobalTable, {
  TableColumn,
} from "../../../../../components/ui/GlobalTable";
import {
  ReferralUser,
  useAddAdvertisementToPulseMutation,
} from "../../../rewardsAndResourcesApi";
import DatePickerModal from "./DatePickerModal";

export type ReferralUserRow = ReferralUser & {
  advertise?: null;
};

interface ReferralTableProps {
  data?: ReferralUserRow[];
  isLoading?: boolean;
}

const ReferralTable: React.FC<ReferralTableProps> = ({
  data = [],
  isLoading,
}) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<ReferralUserRow | null>(
    null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [addAdvertisementToPulse, { isLoading: isAddingToPulse }] =
    useAddAdvertisementToPulseMutation();

  const handleAdvertiseClick = (user: ReferralUserRow) => {
    setSelectedUser(user);
    setIsDatePickerOpen(true);
  };

  const handleDateSelect = async (selectedDate: Date) => {
    if (!selectedUser) return;

    // Format date as YYYY-MM-DD to avoid timezone issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    console.log("Selected Date in Table ::", selectedDate);
    console.log("Formatted Date String ::", dateString);

    try {
      const result = await addAdvertisementToPulse({
        userId: selectedUser._id,
        selectedDate: dateString,
      }).unwrap();

      // Close the date picker
      setIsDatePickerOpen(false);
      setSelectedUser(null);

      // Navigate to the daily pulse edit page
      navigate(
        `/admin/learnings/dailyPulse/review/${result.data.dailyPulseId}`
      );
    } catch (error) {
      console.error("Failed to add advertisement to pulse:", error);
      // You might want to show an error toast here
    }
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
    setSelectedUser(null);
  };
  const columns: TableColumn[] = useMemo(
    () => [
      {
        id: "name",
        label: "User",
        minWidth: 200,
        align: "left",
        render: (_, row: ReferralUserRow) => (
          <Typography variant="body2" color="black">
            {row.name || "—"}
          </Typography>
        ),
      },
      {
        id: "companyMail",
        label: "Company",
        minWidth: 140,
        render: (value: string | undefined) => (
          <Typography variant="body2" color="black">
            {value || "—"}
          </Typography>
        ),
      },
      {
        id: "contact",
        label: "Contact",
        minWidth: 140,
        render: (value: string | undefined) => (
          <Typography variant="body2" color="black">
            {value || "—"}
          </Typography>
        ),
      },
      {
        id: "totalStars",
        label: "Total Stars",
        align: "center",
        minWidth: 120,
        render: (value: number) => (
          <Typography variant="body2" fontWeight={600} color="black">
            {value ?? 0}
          </Typography>
        ),
      },
      {
        id: "addReady",
        label: "Add Ready",
        align: "center",
        minWidth: 120,
        render: (value: boolean) => (
          <Typography
            variant="body2"
            fontWeight={600}
            color={value ? "success.main" : "error.main"}
          >
            {value ? "Yes" : "No"}
          </Typography>
        ),
      },
      {
        id: "advertise",
        label: "Advertise",
        align: "center",
        minWidth: 160,
        render: (_, row: ReferralUserRow) => {
          if (!row.hasAdvertisementClaim) {
            return (
              <Typography variant="body2" color="text.secondary">
                Not Applied
              </Typography>
            );
          }

          const isEligible = !row.advertised;

          return (
            <Button
              variant="contained"
              size="small"
              disabled={!isEligible}
              onClick={() => isEligible && handleAdvertiseClick(row)}
              sx={{
                backgroundColor: isEligible ? "#A04AD4" : "#D1D5DB",
                color: isEligible ? "#FFFFFF" : "#6B7280",
                textTransform: "none",
                borderRadius: "6px",
                px: 3,
              }}
            >
              {row.advertised ? "Advertised" : "Advertise"}
            </Button>
          );
        },
      },
    ],
    [handleAdvertiseClick]
  );

  const tableData = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        advertise: null,
      })),
    [data]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          bgcolor: "white",
          border: "1px solid #A04AD4",
          borderRadius: "8px",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <>
      <GlobalTable
        columns={columns}
        data={tableData}
        stickyHeader
        maxHeight={520}
        title="List"
      />

      <DatePickerModal
        open={isDatePickerOpen}
        onClose={handleDatePickerClose}
        onDateSelect={handleDateSelect}
        userName={selectedUser?.name || ""}
        isLoading={isAddingToPulse}
      />
    </>
  );
};

export default ReferralTable;
