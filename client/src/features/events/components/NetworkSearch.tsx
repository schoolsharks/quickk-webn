import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion, AnimatePresence } from "framer-motion";
import GlobalButton from "../../../components/ui/button";
import { useLazySearchNetworkUsersQuery } from "../../user/userApi";

// Updated interface to match backend response
interface NetworkProfile {
  _id: string;
  name: string;
  designation?: string;
  businessName?: string;
  businessCategory?: string;
  specialisation?: string;
  companyMail?: string;
  contact?: string;
  isConnected?: boolean;
  showIcons?: boolean;
  webnClubMember?: boolean;
}

const NetworkSearch: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<NetworkProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // RTK Query hook for searching users
  const [searchUsers, { data: searchData, isLoading }] =
    useLazySearchNetworkUsersQuery();

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        searchUsers({
          name: searchQuery,
          businessCategory: searchQuery,
          designation: searchQuery,
          specialisation: searchQuery,
          page: 1,
          limit: 20,
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchUsers]);

  // Update profiles when search data changes
  useEffect(() => {
    if (searchData?.data) {
      const transformedProfiles: NetworkProfile[] = searchData.data.map(
        (user: any) => ({
          _id: user._id,
          name: user.name || "Unknown User",
          designation: user.designation || "",
          businessName: user.businessName || "Not specified",
          businessCategory: user.businessCategory || "Not specified",
          specialisation: user.specialisation || "",
          companyMail: user.companyMail,
          contact: user.contact,
          webnClubMember: user.webnClubMember || false,
          isConnected: false,
          showIcons: false,
        })
      );
      
      // Sort profiles: webnClubMember true comes first
      const sortedProfiles = transformedProfiles.sort((a, b) => {
        // If both are webn members or both are not, maintain original order
        if (a.webnClubMember === b.webnClubMember) return 0;
        // If a is webn member and b is not, a comes first
        if (a.webnClubMember && !b.webnClubMember) return -1;
        // If b is webn member and a is not, b comes first
        return 1;
      });
      
      setProfiles(sortedProfiles);
    } else {
      setProfiles([]);
    }
  }, [searchData]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(value.trim().length > 2);
  };

  const handleQuickkConnect = (profileId: string) => {
    // Toggle the icons display
    setProfiles((prev) =>
      prev.map((profile) =>
        profile._id === profileId
          ? { ...profile, showIcons: !profile.showIcons }
          : profile
      )
    );
  };

  // Helper function to create email message
  const createEmailMessage = (recipientName: string) => {
    const subject = "Let's Connect - Found you on Webn";
    const body = `Hi ${recipientName},

I hope this message finds you well. I found your profile on Webn and would love to connect with you.

I'm interested in networking with professionals like yourself and believe we could have some great opportunities to collaborate or share insights.

Looking forward to connecting!

Best regards`;

    return { subject, body };
  };

  // Helper function to create WhatsApp message
  const createWhatsAppMessage = (recipientName: string) => {
    return `Hi ${recipientName}, I found your profile on Webn and wanted to connect with you. I'd love to network and explore potential collaboration opportunities. Looking forward to hearing from you!`;
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
          marginBottom: 4,
          borderRadius: "0px",
          backgroundColor: "#CD7BFF17",
          border: "none",
          overflow: "hidden",
        }}
      >
        <Box display={"flex"} justifyContent={"space-between"} mx={"16px"}>
          {/* Role Badge */}
          {profile.designation != "" && (
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.paper,
                padding: "4px 12px",
                display: "inline-block",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                {profile.designation}
              </Typography>
            </Box>
          )}

          {/* webnClubMember Badge */}
          {profile.webnClubMember && (
            <Box
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                padding: "4px 12px",
                display: "inline-block",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                Webn Member
              </Typography>
            </Box>
          )}
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
                {profile.businessName}
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
              Specializes in
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={6}>
              {profile.businessCategory &&
                profile.businessCategory
                  .split(",")
                  .map((category: string, index: number) => (
                    <Chip
                      key={index}
                      label={category}
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
              {profile.specialisation && (
                <Chip
                  label={profile.specialisation}
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
              )}
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
                Community Member
              </Typography>
            </Box>
          </Box>

          {/* Quickk Connect Button */}
          <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <GlobalButton
              onClick={() => handleQuickkConnect(profile._id)}
              fullWidth
              sx={{
                backgroundColor: theme.palette.text.primary,
                color: theme.palette.background.paper,
                borderRadius: "0px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "16px",
                padding: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.text.secondary,
                },
              }}
            >
              {profile.showIcons ? (
                <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                  width="100%"
                  gap={2}
                >
                  {/* LinkedIn Icon */}
                  <Tooltip title="Share about connecting on LinkedIn">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#0077B5", // LinkedIn blue
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                      onClick={
                        () => {}
                        //   (e) => {
                        //   e.stopPropagation();
                        //   // Create a LinkedIn share post about wanting to connect
                        //   const shareText = `I found ${profile.name} on Webn and would love to connect! They specialize in ${profile.specialisation || profile.businessCategory} and work at ${profile.businessName}. Great to see professionals connecting through Webn! #Networking #Webn`;
                        //   const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://webn.in')}&text=${encodeURIComponent(shareText)}`;
                        //   window.open(linkedinShareLink, "_blank");
                        // }
                      }
                    >
                      <LinkedInIcon
                        sx={{
                          color: "white",
                          fontSize: "20px",
                        }}
                      />
                    </Box>
                  </Tooltip>

                  {/* Email Icon */}
                  <Tooltip
                    title={
                      profile.companyMail
                        ? `Send email to ${profile.companyMail}`
                        : "Email not available"
                    }
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: profile.companyMail
                          ? "#EA4335"
                          : "#CCCCCC", // Gmail red or disabled gray
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: profile.companyMail ? "pointer" : "not-allowed",
                        transition: "transform 0.2s ease",
                        opacity: profile.companyMail ? 1 : 0.5,
                        "&:hover": {
                          transform: profile.companyMail
                            ? "scale(1.1)"
                            : "none",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (profile.companyMail) {
                          const emailData = createEmailMessage(profile.name);
                          const mailtoLink = `mailto:${
                            profile.companyMail
                          }?subject=${encodeURIComponent(
                            emailData.subject
                          )}&body=${encodeURIComponent(emailData.body)}`;
                          window.open(mailtoLink, "_blank");
                        }
                      }}
                    >
                      <EmailIcon
                        sx={{
                          color: "white",
                          fontSize: "20px",
                        }}
                      />
                    </Box>
                  </Tooltip>

                  {/* WhatsApp Icon */}
                  <Tooltip
                    title={
                      profile.contact
                        ? `Send WhatsApp message to ${profile.contact}`
                        : "Phone number not available"
                    }
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: profile.contact
                          ? "#25D366"
                          : "#CCCCCC", // WhatsApp green or disabled gray
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: profile.contact ? "pointer" : "not-allowed",
                        transition: "transform 0.2s ease",
                        opacity: profile.contact ? 1 : 0.5,
                        "&:hover": {
                          transform: profile.contact ? "scale(1.1)" : "none",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (profile.contact) {
                          const message = createWhatsAppMessage(profile.name);
                          // Format the phone number (remove any non-digits and add country code if needed)
                          let phoneNumber = profile.contact.replace(/\D/g, "");
                          // If the number doesn't start with country code, assume it's Indian (+91)
                          if (phoneNumber.length === 10) {
                            phoneNumber = "91" + phoneNumber;
                          }
                          const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                            message
                          )}`;
                          window.open(whatsappLink, "_blank");
                        }
                      }}
                    >
                      <WhatsAppIcon
                        sx={{
                          color: "white",
                          fontSize: "20px",
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              ) : (
                <motion.span
                  initial={false}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Quickk Connect
                </motion.span>
              )}
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
              color: theme.palette.text.secondary,
              fontSize: "16px",
              padding: "12px 0px",
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

      {/* Results Count */}
      {isSearching && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mx="24px"
          mb="16px"
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "14px",
            }}
          >
            Filters
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "14px",
            }}
          >
            {profiles.length} results
          </Typography>
        </Box>
      )}

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
        ) : isLoading ? (
          // Loading state
          <motion.div
            key="loading"
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
                  color: theme.palette.text.secondary,
                  fontSize: "16px",
                }}
              >
                Searching for professionals...
              </Typography>
            </Box>
          </motion.div>
        ) : profiles.length > 0 ? (
          // Results found
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
            // sx={{ maxHeight: "600px", overflowY: "auto" }}
            >
              {profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} />
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
