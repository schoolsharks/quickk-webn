import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import DailyPulseStats, { Stats } from "./DailyPulseStats";
import DailyPulseToolbar from "./DailyPulseToolbar";
import DailyPulseTable from "./DailyPulseTable";
import {
  useGetDailyPulseTableQuery,
  useSearchDailyPulseQuery,
} from "../../dailyPulseApi";

interface DailyPulseLayoutProps {
  DailyPulseStatsProps: Stats;
}

const DailyPulseLayout: React.FC<DailyPulseLayoutProps> = ({
  DailyPulseStatsProps,
}) => {
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedStatus, setDebouncedStatus] = useState("");

  // Debounce status search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStatus(searchStatus);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchStatus]);

  // Reset page when date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchDate]);

  // Use search query when there's a search term or date
  const shouldUseSearch = searchDate !== null || debouncedStatus.trim() !== "";

  const searchParams: any = {
    page: currentPage,
    limit: 20,
  };

  if (searchDate) {
    searchParams.publishOn = searchDate.toISOString();
  }
  if (debouncedStatus.trim()) {
    searchParams.status = debouncedStatus.toLowerCase();
  }

  const { data: searchData, isLoading: searchLoading } =
    useSearchDailyPulseQuery(searchParams, { skip: !shouldUseSearch });

  const { data: regularData, isLoading: regularLoading } =
    useGetDailyPulseTableQuery({ skip: shouldUseSearch });

  const currentData = shouldUseSearch ? searchData?.data : regularData;
  const isLoading = shouldUseSearch ? searchLoading : regularLoading;

  return (
    <Grid container p={"24px"} spacing={"24px"}>
      <Grid size={12}>
        <DailyPulseStats Stats={DailyPulseStatsProps || []} />
      </Grid>
      <Grid size={12}>
        <DailyPulseToolbar
          onDateChange={setSearchDate}
          onStatusChange={setSearchStatus}
          searchDate={searchDate}
          searchStatus={searchStatus}
        />
      </Grid>
      <Grid size={12}>
        <DailyPulseTable data={currentData || []} isLoading={isLoading} />
      </Grid>
    </Grid>
  );
};

export default DailyPulseLayout;
