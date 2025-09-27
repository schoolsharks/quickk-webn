import React, { useMemo } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import GlobalTable, {
  TableColumn,
} from "../../../../../components/ui/GlobalTable";
import { ReferralUser } from "../../../rewardsAndResourcesApi";

export type ReferralUserRow = ReferralUser & {
  advertise?: null;
};

interface ReferralTableProps {
  data?: ReferralUserRow[];
  isLoading?: boolean;
  onAdvertiseClick: (user: ReferralUserRow) => void;
}

const ReferralTable: React.FC<ReferralTableProps> = ({
  data = [],
  isLoading,
  onAdvertiseClick,
}) => {
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
        id: "webnClubMember",
        label: "Signed Up",
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
              onClick={() => isEligible && onAdvertiseClick(row)}
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
    [onAdvertiseClick]
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
    <GlobalTable
      columns={columns}
      data={tableData}
      stickyHeader
      maxHeight={520}
    />
  );
};

export default ReferralTable;
