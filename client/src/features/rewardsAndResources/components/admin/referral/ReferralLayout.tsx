import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Pagination, Snackbar } from "@mui/material";
import UserToolbar from "../../../../admin/user/UserToolbar";
import ReferralStats from "./ReferralStats";
import ReferralTable, { ReferralUserRow } from "./ReferralTable";
import ReferralFilterDrawer, {
  ReferralSortOption,
} from "./ReferralFilterDrawer";
import {
  useGetReferralStatsQuery,
  useGetReferralUsersQuery,
  useMarkReferralAdvertisedMutation,
} from "../../../rewardsAndResourcesApi";

const ReferralLayout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<ReferralSortOption>("mostStars");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const PAGE_SIZE = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: statsData,
    isLoading: statsLoading,
    isFetching: statsFetching,
  } = useGetReferralStatsQuery();

  const {
    data: referralData,
    isLoading: tableLoading,
    isFetching: tableFetching,
  } = useGetReferralUsersQuery({
    search: debouncedSearch || undefined,
    page: currentPage,
    sortBy,
    limit: PAGE_SIZE,
  });

  const [markAdvertised, { isLoading: markingAdvertised }] =
    useMarkReferralAdvertisedMutation();

  const stats = statsData?.data;
  const totalPages = referralData?.data?.totalPages ?? 1;

  const sortUsers = (users: ReferralUserRow[]) => {
    const cloned = [...users];
    switch (sortBy) {
      case "mostStars":
        return cloned.sort((a, b) => b.totalStars - a.totalStars);
      case "leastStars":
        return cloned.sort((a, b) => a.totalStars - b.totalStars);
      case "hasClaim":
        return cloned.sort((a, b) => {
          if (a.hasAdvertisementClaim === b.hasAdvertisementClaim) {
            return (b.totalStars || 0) - (a.totalStars || 0);
          }
          return a.hasAdvertisementClaim ? -1 : 1;
        });
      case "recent":
        return cloned.sort((a, b) => {
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateB - dateA;
        });
      default:
        return cloned;
    }
  };

  const tableData = useMemo(() => {
    const users = referralData?.data?.users ?? [];
    return sortUsers(users);
  }, [referralData?.data?.users, sortBy]);

  const handleFilterOpen = () => setFilterDrawerOpen(true);
  const handleFilterClose = () => setFilterDrawerOpen(false);
  const handleSortChange = (value: ReferralSortOption) => setSortBy(value);
  const handleApplyFilter = () => setFilterDrawerOpen(false);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleAdvertise = async (user: ReferralUserRow) => {
    if (!user.advertisementClaimId) return;

    try {
      await markAdvertised({ claimId: user.advertisementClaimId }).unwrap();
      setSnackbar({
        open: true,
        message: `${user.name}'s advertisement marked as live.`,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update advertisement status.",
      });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ open: false, message: "" });

  return (
    <>
      <Grid container p="24px" spacing="24px">
        <Grid size={12}>
          <ReferralStats
            stats={stats}
            isLoading={statsLoading || statsFetching}
          />
        </Grid>
        <Grid size={12}>
          <UserToolbar
            onSearchChange={setSearchTerm}
            searchValue={searchTerm}
            onFilterClick={handleFilterOpen}
            button={false}
          />
        </Grid>
        <Grid size={12}>
          <ReferralTable
            data={tableData}
            isLoading={tableLoading || tableFetching || markingAdvertised}
            onAdvertiseClick={handleAdvertise}
          />
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      <ReferralFilterDrawer
        open={filterDrawerOpen}
        onClose={handleFilterClose}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onApply={handleApplyFilter}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default ReferralLayout;
