import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import UserToolbar from "./UserToolbar";
import UserTable from "./UserTable";
import UserFilterDrawer, { SortOption } from "./UserFilterDrawer";
import {
  useGetAllUsersTableDataQuery,
  useSearchUsersQuery,
} from "../service/adminApi";
import MemberStats from "./MemberStats";

const GowomaniaUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recentActivity");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use search query when there's a search term, otherwise use regular query
  const shouldUseSearch = debouncedSearch.trim() !== "";

  const { data: searchData, isLoading: searchLoading } = useSearchUsersQuery(
    {
      name: debouncedSearch,
      companyMail: debouncedSearch,
      contact: debouncedSearch,
      page: currentPage,
      limit: 20,
    },
    { skip: !shouldUseSearch }
  );

  const { data: regularData, isLoading: regularLoading } =
    useGetAllUsersTableDataQuery(false, { skip: shouldUseSearch });

  const currentData = shouldUseSearch ? searchData?.data : regularData;
  const isLoading = shouldUseSearch ? searchLoading : regularLoading;

  // Sorting function
  const sortUsers = (users: any[]) => {
    if (!users) return [];

    return [...users].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name);

        case "category":
          const categoryA = a.businessCategory || "";
          const categoryB = b.businessCategory || "";
          if (!categoryA && categoryB) return 1; // Empty categories at bottom
          if (categoryA && !categoryB) return -1;
          return categoryA.localeCompare(categoryB);

        case "active":
          return b.learningStreak - a.learningStreak; // Active members first

        case "notActive":
          return a.learningStreak - b.learningStreak; // Not active members first

        case "listed":
          // Listed members first (true before false)
          if (a.listed === b.listed) return 0;
          return a.listed ? -1 : 1;

        case "recentActivity":
        default:
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return dateB - dateA; // Most recent first, empty dates last
      }
    });
  };

  const sortedData = sortUsers(currentData || []);

  const handleFilterOpen = () => setFilterDrawerOpen(true);
  const handleFilterClose = () => setFilterDrawerOpen(false);
  const handleSortChange = (newSortBy: SortOption) => setSortBy(newSortBy);
  const handleApplyFilter = () => setFilterDrawerOpen(false);
  const Stats = {
    total: regularData?.length || 0,
    Active:
      regularData?.filter((user: any) => user.learningStreak > 0).length || 0,
    moved:
      regularData?.filter((user: any) => !user.webnClubMember)[0].totalUsers -
        regularData?.filter((user: any) => !user.webnClubMember).length || 0,
    // NotActive:
    //   regularData?.filter((user: any) => user.learningStreak === 0).length || 0,
    Listed: regularData?.filter((user: any) => user.listed).length || 0,
  };

  return (
    <>
      <Grid container p={"24px"} spacing={"24px"}>
        <Grid size={12}>
          <MemberStats Stats={Stats} webnClubMember={false} />
        </Grid>
        <Grid size={12}>
          <UserToolbar
            onSearchChange={setSearchTerm}
            searchValue={searchTerm}
            onFilterClick={handleFilterOpen}
          />
        </Grid>
        <Grid size={12}>
          <UserTable
            data={sortedData}
            isLoading={isLoading}
            webnClubMember={false}
          />
        </Grid>
      </Grid>

      <UserFilterDrawer
        open={filterDrawerOpen}
        onClose={handleFilterClose}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onApply={handleApplyFilter}
      />
    </>
  );
};

export default GowomaniaUsers;
