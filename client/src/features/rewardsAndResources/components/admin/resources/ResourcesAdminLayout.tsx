import React, { useState, useEffect, useMemo } from "react";
import { Stack, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ResourcesStats from "./ResourcesStats";
import ResourcesTable from "./ResourcesTable";
import ResourcesSearchBar from "./ResourcesSearchBar";
import {
  useGetResourcesStatsQuery,
  useSearchResourcesAdminQuery,
  useCreateResourceMutation,
  ResourceData,
} from "../../../rewardsAndResourcesApi";
import GreenButton from "../../../../../components/ui/GreenButton";

interface ResourcesAdminLayoutProps {}

const ResourcesAdminLayout: React.FC<ResourcesAdminLayoutProps> = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // API hooks
  const [createResource, { isLoading: isCreating }] =
    useCreateResourceMutation();

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  // API calls
  const { data: statsData, isLoading: statsLoading } =
    useGetResourcesStatsQuery();

  const { data: resourcesData, isLoading: resourcesLoading } =
    useSearchResourcesAdminQuery({
      search: debouncedSearchTerm,
      page,
      limit,
    });

  // Transform data for table with redeemed count
  const transformedData = useMemo(() => {
    if (!resourcesData?.data?.resources) return [];

    return resourcesData.data.resources.map((resource: ResourceData) => ({
      ...resource,
      totalRedeemed: (resource as any).totalRedeemed || 0,
    }));
  }, [resourcesData]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCreateNew = async () => {
    try {
      // Create a new resource with minimal data
      const defaultExpiryDate = new Date();
      defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30); // 30 days from now

      const result = await createResource({
        heading: "",
        subHeading: "",
        image: "",
        type: "SERVICE",
        targetAudience: ["All"],
        companyName: "",
        companyLogo: "",
        companyEmail: "",
        companyContact: "",
        description: [
          { title: "What's included", points: [""] },
          { title: "Perfect For", points: [""] },
          { title: "Add ons (at extra cost)", points: [""] },
          { title: "Note", points: [""] },
        ],
        stars: 0,
        quantity: 150,
        expiryDate: defaultExpiryDate.toISOString(),
        status: "DRAFT",
      }).unwrap();

      // Navigate to edit page for the newly created resource
      if (result.data && result.data._id) {
        navigate(`/admin/resources/edit/${result.data._id}`);
      }
    } catch (error) {
      console.error("Error creating resource:", error);
      alert("Failed to create new resource. Please try again.");
    }
  };

  return (
    <Stack spacing={3} p={3}>
      {/* Stats Cards */}
      <ResourcesStats
        stats={
          statsData?.data || {
            total: 0,
            active: 0,
            drafts: 0,
            totalRedeemed: 0,
          }
        }
        isLoading={statsLoading}
      />

      {/* Search Bar with Create New Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Box flex={1}>
          <ResourcesSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Search reward by name, company"
          />
        </Box>
        <GreenButton
          onClick={handleCreateNew}
          disabled={isCreating}
          startIcon={<AddIcon />}
          sx={{
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 0,
          }}
        >
          {isCreating ? "Creating..." : "Create Resource"}
        </GreenButton>
      </Box>

      {/* Resources Table */}
      <ResourcesTable data={transformedData} isLoading={resourcesLoading} />
    </Stack>
  );
};

export default ResourcesAdminLayout;
