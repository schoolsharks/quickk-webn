import React, { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import ResourcesStats from "./ResourcesStats";
import ResourcesSearchBar from "./ResourcesSearchBar";
import ResourcesTable from "./ResourcesTable";
import {
  useGetResourcesStatsQuery,
  useSearchResourcesAdminQuery,
  ResourceData,
} from "../../../rewardsAndResourcesApi";

const ResourcesLayout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API calls
  const { data: statsData, isLoading: statsLoading } = useGetResourcesStatsQuery();
  const { 
    data: searchData, 
    isLoading: searchLoading 
  } = useSearchResourcesAdminQuery({
    search: debouncedSearch,
    page,
    limit: 10,
  });

  // Transform resources data to include totalRedeemed count
  const transformedData = searchData?.data?.resources?.map((resource: ResourceData) => ({
    ...resource,
    totalRedeemed: resource.totalRedeemed || 0, // Use the actual value from backend
  })) || [];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const stats = statsData?.data || {
    total: 0,
    active: 0,
    drafts: 0,
    totalRedeemed: 0,
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      {/* Stats Cards */}
      <ResourcesStats stats={stats} isLoading={statsLoading} />

      {/* Search Bar */}
      <ResourcesSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search reward by name, date"
      />

      {/* Table */}
      <ResourcesTable 
        data={transformedData} 
        isLoading={searchLoading} 
      />
    </Stack>
  );
};

export default ResourcesLayout;