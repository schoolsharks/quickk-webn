import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import UserToolbar from "./UserToolbar";
import UserTable from "./UserTable";
import {
  useGetAllUsersTableDataQuery,
  useSearchUsersQuery,
} from "../service/adminApi";

const UserLayout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    useGetAllUsersTableDataQuery({ skip: shouldUseSearch });

  const currentData = shouldUseSearch ? searchData?.data  : regularData;
  const isLoading = shouldUseSearch ? searchLoading : regularLoading;

  return (
    <Grid container p={"24px"} spacing={"24px"}>
      <Grid size={12}>
        <UserToolbar onSearchChange={setSearchTerm} searchValue={searchTerm} />
      </Grid>
      <Grid size={12}>
        <UserTable data={currentData || []} isLoading={isLoading} />
      </Grid>
    </Grid>
  );
};

export default UserLayout;
