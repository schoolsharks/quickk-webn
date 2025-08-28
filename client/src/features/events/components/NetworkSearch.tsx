import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Chip,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";
import GlobalButton from "../../../components/ui/button";

// Dummy data - replace with RTK Query later
interface NetworkProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  industries: string[];
  connections: number;
  isConnected?: boolean;
}

const dummyProfiles: NetworkProfile[] = [
  {
    id: "1",
    name: "Designer Name",
    role: "Web Designer",
    company: "Company",
    industries: ["EdTech", "Branding", "Consultancy"],
    connections: 300,
    isConnected: false,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "UX Designer",
    company: "TechCorp",
    industries: ["EdTech", "Healthcare", "Fintech"],
    connections: 450,
    isConnected: false,
  },
  {
    id: "3",
    name: "Mike Chen",
    role: "Product Designer",
    company: "StartupXYZ",
    industries: ["SaaS", "Branding", "E-commerce"],
    connections: 275,
    isConnected: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "Web Designer",
    company: "Creative Agency",
    industries: ["Branding", "Marketing", "Consultancy"],
    connections: 520,
    isConnected: false,
  },
];

const NetworkSearch: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<NetworkProfile[]>(dummyProfiles);
  const [isSearching, setIsSearching] = useState(false);

  // Filter profiles based on search query
  const filteredProfiles = searchQuery.trim()
    ? profiles.filter(
        (profile) =>
          profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.industries.some((industry) =>
            industry.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(value.trim().length > 0);
  };

  const handleQuickkConnect = (profileId: string) => {
    // Update the connection status with animation
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId ? { ...profile, isConnected: true } : profile
      )
    );

    // Reset connection status after 2 seconds to show animation
    setTimeout(() => {
      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileId
            ? { ...profile, isConnected: false }
            : profile
        )
      );
    }, 2000);
  };

  const ProfileCard: React.FC<{ profile: NetworkProfile }> = ({ profile }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          marginBottom: 2,
          borderRadius: "0px",
          backgroundColor: "#CD7BFF17",
          border: "none",
          overflow: "hidden",
        }}
      >
        {/* Role Badge */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,
            padding: "4px 12px",
            display: "inline-block",
            margin: "0px 16px 0 16px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            {profile.role}
          </Typography>
        </Box>

        <CardContent sx={{ padding: "0px !important" }}>
          <Box p={"16px"}>
            {/* Name */}
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: "20px",
                marginBottom: "4px",
              }}
            >
              {profile.name}
            </Typography>

            {/* Company */}
            <Box display="flex" alignItems="center" mb={2} mt={2}>
              <Box
                sx={{
                  width: "3px",
                  height: "16px",
                  backgroundColor: theme.palette.text.primary,
                  marginRight: "8px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {profile.company}
              </Typography>
            </Box>

            {/* Industries */}
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              Belongs to industries like
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={6}>
              {profile.industries.map((industry, index) => (
                <Chip
                  key={index}
                  label={industry}
                  sx={{
                    flex: 1,
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    border: `1px solid ${theme.palette.text.secondary}`,
                    color: theme.palette.text.primary,
                    fontSize: "16px",
                    height: "35px",
                    "& .MuiChip-label": {
                      padding: "0 8px",
                    },
                  }}
                />
              ))}
            </Box>

            {/* Connection Info */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                }}
              >
                Request to connect
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                }}
              >
                {profile.connections}+ Connections
              </Typography>
            </Box>
          </Box>

          {/* Quickk Connect Button */}
          <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <GlobalButton
              onClick={() => handleQuickkConnect(profile.id)}
              fullWidth
              sx={{
                backgroundColor: profile.isConnected
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                color: theme.palette.background.paper,
                borderRadius: "0px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "16px",
                padding: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: profile.isConnected
                    ? theme.palette.primary.light
                    : theme.palette.text.secondary,
                },
              }}
            >
              <motion.span
                initial={false}
                animate={{
                  scale: profile.isConnected ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {profile.isConnected ? "Connected! ✓" : "Quickk Connect"}
              </motion.span>
            </GlobalButton>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box width="100%">
      {/* Search Header */}
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 700,
          fontSize: "20px",
          marginBottom: "30px",
          mx: "24px",
        }}
      >
        What are you looking for?
      </Typography>
      <Box mx={"24px"}>
        {/* Search Input */}
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            marginBottom: "24px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
              borderRadius: "0px",
              "& fieldset": {
                borderColor: theme.palette.text.secondary + "30",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                borderWidth: "2px",
              },
            },
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
              fontSize: "16px",
              padding: "12px 14px",
            },
            "& .MuiInputBase-input::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 1,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {!isSearching ? (
          // No search state
          <motion.div
            key="no-search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                textAlign: "center",
                padding: "40px 20px",
                color: theme.palette.text.secondary,
              }}
            >
              <Typography variant="body1" sx={{ fontSize: "16px" }}>
                Start typing to search for professionals...
              </Typography>
            </Box>
          </motion.div>
        ) : filteredProfiles.length > 0 ? (
          // Results found
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </Box>
          </motion.div>
        ) : (
          // No results found
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                Your search ends here.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                No results found for "{searchQuery}"
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default NetworkSearch;
