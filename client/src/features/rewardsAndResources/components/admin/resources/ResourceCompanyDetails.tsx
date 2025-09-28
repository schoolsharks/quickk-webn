import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  useLazySearchCompaniesQuery,
  CompanySearchResult,
} from "../../../rewardsAndResourcesApi";
import ImageUpload from "../../../../../components/ui/ImageUpload";

interface CompanyFormData {
  companyName: string;
  companyLogo: string | File;
  companyEmail: string;
  companyContact: string;
  image: string | File;
}

interface ResourceCompanyDetailsProps {
  formData: CompanyFormData;
  onFormDataChange: (updates: Partial<CompanyFormData>) => void;
  onCompanySelect?: (company: CompanySearchResult) => void;
}

const ResourceCompanyDetails: React.FC<ResourceCompanyDetailsProps> = ({
  formData,
  onFormDataChange,
  onCompanySelect,
}) => {
  const [searchCompanies] = useLazySearchCompaniesQuery();
  const [companyOptions, setCompanyOptions] = useState<CompanySearchResult[]>([]);

  // Handle company search
  const handleCompanySearch = async (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      try {
        const result = await searchCompanies(searchTerm).unwrap();
        setCompanyOptions(result.data || []);
      } catch (error) {
        console.error("Error searching companies:", error);
      }
    } else {
      setCompanyOptions([]);
    }
  };

  // Handle company selection from autocomplete
  const handleCompanySelect = (company: CompanySearchResult | null) => {
    if (company && onCompanySelect) {
      onCompanySelect(company);
      
      // Fill company details
      onFormDataChange({
        companyName: company.businessName,
        companyLogo: company.businessLogo,
        companyEmail: company.companyMail,
        companyContact: company.contact,
        image: company.businessLogo, // Also update the main image
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#1A1A1A", p: 3 }}>
      <Typography variant="h6" color="white" mb={2}>
        Company details
      </Typography>

      <Typography color="white" mb={1} fontSize="14px">
        Name of the company/member
      </Typography>
      <Autocomplete
        freeSolo
        options={companyOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.businessName
        }
        onInputChange={(_, value) => {
          handleCompanySearch(value);
        }}
        onChange={(_, value) => {
          if (typeof value !== "string") {
            handleCompanySelect(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search Name"
            sx={{
              backgroundColor: "#2A2A2A",
              borderRadius: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
              input: { color: "white" },
              mb: 2,
            }}
          />
        )}
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography color="white" mb={1} fontSize="14px">
            Company Name *
          </Typography>
          <TextField
            fullWidth
            value={formData.companyName}
            onChange={(e) => onFormDataChange({ companyName: e.target.value })}
            sx={{
              backgroundColor: "#2A2A2A",
              borderRadius: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
              input: { color: "white" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <ImageUpload
            value={formData.companyLogo}
            onChange={(value) => onFormDataChange({ companyLogo: value })}
            label="Company Logo"
            height={80}
            previewHeight={60}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography color="white" mb={1} fontSize="14px">
            Company Email
          </Typography>
          <TextField
            fullWidth
            value={formData.companyEmail}
            onChange={(e) => onFormDataChange({ companyEmail: e.target.value })}
            sx={{
              backgroundColor: "#2A2A2A",
              borderRadius: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
              input: { color: "white" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography color="white" mb={1} fontSize="14px">
            Company Contact
          </Typography>
          <TextField
            fullWidth
            value={formData.companyContact}
            onChange={(e) => onFormDataChange({ companyContact: e.target.value })}
            sx={{
              backgroundColor: "#2A2A2A",
              borderRadius: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
              input: { color: "white" },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceCompanyDetails;