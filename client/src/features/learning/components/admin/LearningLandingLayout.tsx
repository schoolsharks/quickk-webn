import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import LearningStats, { Stats } from "./LearningStats";
import LearningToolbar from "./LearningToolbar";
import LearningTable, { LearningTableProps } from "./LearningTable";
import {
  useGetLearningTableDataQuery,
  useSearchLearningQuery,
} from "../../service/learningApi";

interface LearningLayoutProps {
  LearningTableProps: LearningTableProps;
  LearningStatsProps: Stats;
}

const LearningLandingLayout: React.FC<LearningLayoutProps> = ({
  LearningStatsProps,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use search query when there's a search term, otherwise use regular query
  const shouldUseSearch = debouncedSearch.trim() !== "";

  const { data: searchData, isLoading: searchLoading } = useSearchLearningQuery(
    {
      title: debouncedSearch,
      status: debouncedSearch,
      page: currentPage,
      limit: 20,
    },
    { skip: !shouldUseSearch }
  );

  const { data: regularData, isLoading: regularLoading } =
    useGetLearningTableDataQuery({ skip: shouldUseSearch });

  const currentData = shouldUseSearch ? searchData : regularData?.data;
  const isLoading = shouldUseSearch ? searchLoading : regularLoading;
  return (
    <Grid container p={"24px"} spacing={"24px"}>
      <Grid size={12}>
        <LearningStats Stats={LearningStatsProps ?? []} />
      </Grid>
      <Grid size={12}>
        <LearningToolbar
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
        />
      </Grid>
      <Grid size={12}>
        <LearningTable data={currentData || []} isLoading={isLoading} />
      </Grid>
    </Grid>
  );
};

export default LearningLandingLayout;
