import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Grid,
} from "@mui/material";
import { Add, Delete, CloudUpload } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  useCreateBlankEventMutation,
  useUpdateEventMutation,
  useGetEventQuery,
  useImproveEventDescriptionMutation,
} from "../../../events/services/eventsApi";
import GreenButton from "../../../../components/ui/GreenButton";
import AddressAutocomplete from "../../../../components/ui/AddressAutocomplete";
import { AddressOption } from "../../../../types/address";

interface Speaker {
  name: string;
  designation: string;
}

interface Sponsor {
  name: string;
  logo: File | null;
}

interface EventFormData {
  title: string;
  description: string;
  eventType: "ONLINE" | "OFFLINE";
  targetAudience: string[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  address: string;
  virtualMeetingLink: string;
  speakers: Speaker[];
  keyHighlights: string[];
  sponsors: Sponsor[];
  ticketTypes: string[];
  ticketPrice: number;
  starsToBeEarned: number;
  registrationLink: string;
  eventImage: File | null;
}

const EventFormPage: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventType: "OFFLINE",
    targetAudience: [],
    startDate: null,
    endDate: null,
    address: "",
    virtualMeetingLink: "",
    speakers: [{ name: "", designation: "" }],
    keyHighlights: [""],
    sponsors: [{ name: "", logo: null }],
    ticketTypes: [],
    ticketPrice: 0,
    starsToBeEarned: 50,
    registrationLink: "",
    eventImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isImprovingDescription, setIsImprovingDescription] = useState(false);
  const [originalDescription, setOriginalDescription] = useState<string>("");
  const [_selectedAddressData, setSelectedAddressData] = useState<AddressOption | null>(null);

  const [createBlankEvent] = useCreateBlankEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [improveEventDescription] = useImproveEventDescriptionMutation();

  // Only fetch event data if we have a valid eventId (not 'new')
  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
  } = useGetEventQuery(eventId!, {
    skip: !eventId || eventId === "new",
  });

  useEffect(() => {
    if (eventId === "new") {
      handleCreateBlankEvent();
    } else if (eventData?.data) {
      // Set form data from fetched event
      setFormData(transformEventToFormData(eventData.data));
      setLoading(false);
    } else if (eventError) {
      setError("Failed to fetch event data");
      setLoading(false);
    } else if (eventId && eventId !== "new") {
      setLoading(eventLoading);
    }
  }, [eventId, eventData, eventLoading, eventError]);

  const handleCreateBlankEvent = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await createBlankEvent({}).unwrap();
      console.log("Blank event created:", result);

      // Navigate to the edit page with the new event ID
      navigate(`/admin/events/${result.data._id}`, { replace: true });

      // Set the form data with the blank event
      setFormData(transformEventToFormData(result.data));
    } catch (error: any) {
      console.error("Failed to create blank event:", error);
      setError(error?.data?.message || "Failed to create blank event");
    } finally {
      setLoading(false);
    }
  };

  const transformEventToFormData = (event: any): EventFormData => {
    return {
      title: event.title || "",
      description: event.description || "",
      eventType: event.eventType || "OFFLINE",
      targetAudience: event.targetAudience || [],
      startDate: event.startDate ? dayjs(event.startDate) : null,
      endDate: event.endDate ? dayjs(event.endDate) : null,
      address: event.location || "",
      virtualMeetingLink: event.virtualMeetingLink || "",
      speakers:
        event.speakers?.length > 0
          ? event.speakers
          : [{ name: "", designation: "" }],
      keyHighlights:
        event.keyHighlights?.length > 0 ? event.keyHighlights : [""],
      sponsors:
        event.sponsors?.length > 0
          ? event.sponsors
          : [{ name: "", logo: null }],
      ticketTypes: event.ticketInfo.price != 0 ? ["Paid"] : ["Free"],
      ticketPrice: event.ticketInfo.price || 0,
      starsToBeEarned: event.starsToBeEarned || 0,
      registrationLink: event.registrationLink || "",
      eventImage: event.eventImage || null,
    };
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleTargetAudienceChange = (audience: string, checked: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     targetAudience: checked
  //       ? [...prev.targetAudience, audience]
  //       : prev.targetAudience.filter((a) => a !== audience),
  //   }));
  // };

  // const handleTicketTypeChange = (ticketType: string, checked: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     ticketTypes: checked
  //       ? [...prev.ticketTypes, ticketType]
  //       : prev.ticketTypes.filter((t) => t !== ticketType),
  //   }));
  // };

  const handleSpeakerChange = (
    index: number,
    field: keyof Speaker,
    value: string
  ) => {
    const newSpeakers = [...formData.speakers];
    newSpeakers[index] = { ...newSpeakers[index], [field]: value };
    setFormData((prev) => ({ ...prev, speakers: newSpeakers }));
  };

  const addSpeaker = () => {
    setFormData((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { name: "", designation: "" }],
    }));
  };

  const removeSpeaker = (index: number) => {
    if (formData.speakers.length > 1) {
      const newSpeakers = formData.speakers.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, speakers: newSpeakers }));
    }
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.keyHighlights];
    newHighlights[index] = value;
    setFormData((prev) => ({ ...prev, keyHighlights: newHighlights }));
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      keyHighlights: [...prev.keyHighlights, ""],
    }));
  };

  const removeHighlight = (index: number) => {
    if (formData.keyHighlights.length > 1) {
      const newHighlights = formData.keyHighlights.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, keyHighlights: newHighlights }));
    }
  };

  const handleSponsorChange = (
    index: number,
    field: keyof Sponsor,
    value: string | File | null
  ) => {
    const newSponsors = [...formData.sponsors];
    newSponsors[index] = { ...newSponsors[index], [field]: value };
    setFormData((prev) => ({ ...prev, sponsors: newSponsors }));
  };

  const addSponsor = () => {
    setFormData((prev) => ({
      ...prev,
      sponsors: [...prev.sponsors, { name: "", logo: null }],
    }));
  };

  const removeSponsor = (index: number) => {
    if (formData.sponsors.length > 1) {
      const newSponsors = formData.sponsors.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, sponsors: newSponsors }));
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, eventImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImproveDescription = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters long to improve with AI");
      return;
    }

    if (!formData.title || formData.title.trim().length === 0) {
      setError("Event title is required to improve description");
      return;
    }

    setIsImprovingDescription(true);
    setError(null);

    try {
      // Store original description for potential undo
      setOriginalDescription(formData.description);

      const result = await improveEventDescription({
        originalDescription: formData.description,
        eventTitle: formData.title,
        eventType: formData.eventType,
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        description: result.improvedDescription,
      }));

      // Optional: Show success message
      console.log("Description improved successfully!");
    } catch (error: any) {
      console.error("Failed to improve description:", error);
      setError(error?.data?.message || "Failed to improve description with AI");
    } finally {
      setIsImprovingDescription(false);
    }
  };

  const handleUndoImprovement = () => {
    if (originalDescription) {
      setFormData((prev) => ({
        ...prev,
        description: originalDescription,
      }));
      setOriginalDescription("");
    }
  };

  const handleAddressChange = (address: string, addressData?: AddressOption) => {
    handleInputChange("address", address);
    
    // Store the complete address data for potential future use (coordinates, etc.)
    if (addressData) {
      setSelectedAddressData(addressData);
      console.log('Selected address coordinates:', addressData.coordinates);
    } else {
      setSelectedAddressData(null);
    }
  };

  const handleSaveToDrafts = async () => {
    await handleSubmit("draft");
  };

  const handlePublish = async () => {
    await handleSubmit("upcoming");
  };

  const handleSubmit = async (status: "draft" | "upcoming") => {
    if (!eventId || eventId === "new" || !formData) return;

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("eventType", formData.eventType);
      formDataToSend.append(
        "targetAudience",
        JSON.stringify(formData.targetAudience)
      );
      
      // Send location or virtualMeetingLink based on event type
      if (formData.eventType === "ONLINE") {
        formDataToSend.append("virtualMeetingLink", formData.virtualMeetingLink);
      } else {
        formDataToSend.append("location", formData.address);
      }
      
      formDataToSend.append("speakers", JSON.stringify(formData.speakers));
      formDataToSend.append(
        "keyHighlights",
        JSON.stringify(formData.keyHighlights)
      );
      formDataToSend.append(
        "ticketTypes",
        JSON.stringify(formData.ticketTypes)
      );
      formDataToSend.append(
        "ticketInfo",
        JSON.stringify({ price: formData.ticketPrice })
      );
      formDataToSend.append(
        "starsToBeEarned",
        formData.starsToBeEarned.toString()
      );
      formDataToSend.append("registrationLink", formData.registrationLink);
      formDataToSend.append("status", status);

      if (formData.startDate) {
        formDataToSend.append("startDate", formData.startDate.toISOString());
      }
      if (formData.endDate) {
        formDataToSend.append("endDate", formData.endDate.toISOString());
      }

      if (formData.eventImage) {
        formDataToSend.append("eventImage", formData.eventImage);
      }

      // Handle sponsors with logos
      const sponsorsData = await Promise.all(
        formData.sponsors.map(async (sponsor, index) => {
          if (sponsor.logo instanceof File) {
            formDataToSend.append(`sponsor_logo_${index}`, sponsor.logo);
            return { name: sponsor.name, logo: `sponsor_logo_${index}` };
          } else if (typeof sponsor.logo === "string" && sponsor.logo) {
            // Already a URL, just send as is
            return { name: sponsor.name, logo: sponsor.logo };
          } else {
            return { name: sponsor.name, logo: null };
          }
        })
      );
      formDataToSend.append("sponsors", JSON.stringify(sponsorsData));


      await updateEvent({ eventId, eventData: formDataToSend }).unwrap();

      // Navigate back to events list
      navigate("/admin/events", {
        state: {
          message: `Event ${
            status === "draft" ? "saved to drafts" : "published"
          } successfully!`,
        },
      });
    } catch (error: any) {
      console.error("Failed to update event:", error);
      setError(error?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if ((loading || eventLoading) && !formData.title) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          p: "24px",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            color: "white",
            borderRadius: "0px",
            border: "none",
            boxSizing: "none",
            p: 0,
            overflow: "hidden",
          }}
        >
          {/* Basic Details Section */}
          <Box
            sx={{
              p: "24px",
              bgcolor: "#0D0D0D",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                mb: 2,
              }}
            >
              Basic Details
            </Typography>

            {/* Banner Upload */}
            <Box sx={{ mb: 6 }}>
              <Box
                mx={"auto"}
                sx={{
                  width: "380px",
                  height: "300px",
                  bgcolor: "#333",
                  border: "2px dashed #555",
                  borderRadius: "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  mb: 1,
                  background: (() => {
                    if (formData.eventImage instanceof File) {
                      return `url(${URL.createObjectURL(formData.eventImage)})`;
                    } else if (typeof formData.eventImage === "string" && formData.eventImage) {
                      return `url(${formData.eventImage})`;
                    } else if (bannerPreview) {
                      return `url(${bannerPreview})`;
                    }
                    return "none";
                  })(),
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  position: "relative",
                }}
                onClick={() =>
                  document.getElementById("banner-upload")?.click()
                }
              >
                {!formData.eventImage && !bannerPreview && (
                  <Box textAlign="center">
                    <CloudUpload sx={{ fontSize: 40, color: "#666", mb: 1 }} />
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <GreenButton
                  onClick={() =>
                    document.getElementById("banner-upload")?.click()
                  }
                  sx={{ width: "250px" }}
                >
                  {bannerPreview ? "Change Banner" : "Upload Banner"}
                </GreenButton>
                <Typography variant="caption" sx={{ color: "#999" }}>
                  Size: 390px x 300px
                </Typography>
              </Box>

              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleBannerUpload}
              />
            </Box>

            {/* Event Title */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                Event Title
              </Typography>
              <TextField
                fullWidth
                placeholder="A short sweet sentence of your event."
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: "0px",
                    bgcolor: "#333",
                    "& fieldset": {
                      borderColor: "#555",
                    },
                    "&:hover fieldset": {
                      borderColor: "#777",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#999",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Event Type and Target Audience */}
            <Grid container spacing={2} sx={{ mb: 6 }}>
              <Grid size={6}>
                <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                  Event Type
                </Typography>
                <FormControl fullWidth size="medium">
                  <Select
                    value={formData.eventType}
                    onChange={(e) =>
                      handleInputChange("eventType", e.target.value)
                    }
                    sx={{
                      borderRadius: "0px",
                      color: "white",
                      bgcolor: "#333",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#555",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#777",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#999",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="OFFLINE">Offline</MenuItem>
                    <MenuItem value="ONLINE">Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                  Target Audience
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                  }}
                >
                  {["All", "Gowomania Only", "Webn Only"].map((audience) => (
                    <Box bgcolor={"#252525"} padding={"4px"} key={audience}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.targetAudience[0] === audience}
                            onChange={(e) =>
                              handleInputChange(
                                "targetAudience",
                                e.target.checked ? [audience] : []
                              )
                            }
                            size="medium"
                            sx={{
                              color: "white",
                              "&.Mui-checked": {
                                color: "white",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "16px" }}
                          >
                            {audience}
                          </Typography>
                        }
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Date & Time and Address */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={6}>
                <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                  Date & Time
                </Typography>
                <Box
                  display={"flex"}
                  gap={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <DateTimePicker
                    value={formData.startDate}
                    onChange={(newValue) =>
                      handleInputChange("startDate", newValue)
                    }
                    sx={{
                      borderColor: "white",
                      "& .MuiPickersInputBase-root ": {
                        color: "white",
                        borderColor: "#FFFFFF",
                        borderRadius: "0px",
                      },
                    }}
                    slotProps={{
                      textField: {
                        size: "medium",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            bgcolor: "#333",
                            "& fieldset": {
                              borderColor: "white",
                            },
                            "&:hover fieldset": {
                              borderColor: "white",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "white",
                            },
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
                          },
                          "& .MuiPickersInputBase-root ": {
                            color: "white",
                            borderColor: "#FFFFFF",
                            borderRadius: "0px",
                          },
                        },
                      },
                    }}
                  />
                  <Typography variant="body1">To</Typography>
                  <DateTimePicker
                    value={formData.endDate}
                    onChange={(newValue) =>
                      handleInputChange("endDate", newValue)
                    }
                    sx={{
                      borderColor: "white",
                      "& .MuiPickersInputBase-root ": {
                        color: "white",
                        borderColor: "#FFFFFF",
                        borderRadius: "0px",
                      },
                    }}
                    slotProps={{
                      textField: {
                        size: "medium",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            bgcolor: "#333",
                            "& fieldset": {
                              borderColor: "white",
                            },
                            "&:hover fieldset": {
                              borderColor: "white",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "white",
                            },
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
                          },
                          "& .MuiPickersInputBase-root ": {
                            color: "white",
                            borderColor: "#FFFFFF",
                            borderRadius: "0px",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={6}>
                <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                  {formData.eventType === "ONLINE" ? "Meeting URL" : "Address"}
                </Typography>
                {formData.eventType === "ONLINE" ? (
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Enter meeting URL (e.g., Zoom, Teams, etc.)"
                    value={formData.virtualMeetingLink}
                    onChange={(e) =>
                      handleInputChange("virtualMeetingLink", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        borderRadius: "0px",
                        bgcolor: "#333",
                        "& fieldset": {
                          borderColor: "#555",
                        },
                        "&:hover fieldset": {
                          borderColor: "#777",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#999",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#999",
                        opacity: 1,
                      },
                    }}
                  />
                ) : (
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder="Start typing address..."
                    size="medium"
                  />
                )}
              </Grid>
            </Grid>
          </Box>

          {/* About the Event Section */}
          <Box sx={{ p: "24px", mt: 10, bgcolor: "#0D0D0D" }}>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                mb: 2,
              }}
            >
              About the Event
            </Typography>

            {/* Description */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1" sx={{ fontSize: "12px" }}>
                    Description
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      color: formData.description.length > 500 ? "#ff6b6b" : "#999", 
                      fontSize: "10px" 
                    }}
                  >
                    {formData.description.length}/500 characters
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {originalDescription && (
                    <Button
                      size="small"
                      onClick={handleUndoImprovement}
                      sx={{
                        color: "#999",
                        textTransform: "none",
                        fontSize: "12px",
                        minWidth: "auto",
                        p: "4px 8px",
                      }}
                    >
                      Undo
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={handleImproveDescription}
                    disabled={isImprovingDescription || !formData.description?.trim() || formData.description.trim().length < 10}
                    sx={{
                      color: isImprovingDescription ? "#666" : "white",
                      textTransform: "none",
                      fontSize: "14px",
                      minWidth: "auto",
                      p: "4px 8px",
                      "&:disabled": {
                        color: "#666",
                      },
                    }}
                  >
                    {isImprovingDescription ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={12} sx={{ color: "#666" }} />
                        Improving...
                      </Box>
                    ) : (
                      "✨ Improve with AI"
                    )}
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter event description (min 10 characters to use AI improvement)..."
                value={formData.description}
                onChange={(e) => {
                  // Character limit of 500
                  if (e.target.value.length <= 500) {
                    handleInputChange("description", e.target.value);
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    color: "white",
                    bgcolor: "#333",
                    "& fieldset": {
                      borderColor: formData.description.length > 500 ? "#ff6b6b" : "#555",
                    },
                    "&:hover fieldset": {
                      borderColor: formData.description.length > 500 ? "#ff6b6b" : "#777",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: formData.description.length > 500 ? "#ff6b6b" : "#999",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Speaker */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                Speaker
              </Typography>
              {formData.speakers.map((speaker, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="Speaker Name"
                      value={speaker.name}
                      onChange={(e) =>
                        handleSpeakerChange(index, "name", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0px",
                          color: "white",
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#999",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="Designation"
                      value={speaker.designation}
                      onChange={(e) =>
                        handleSpeakerChange(
                          index,
                          "designation",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0px",
                          color: "white",
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#999",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        },
                      }}
                    />
                    {formData.speakers.length > 1 && (
                      <IconButton
                        size="medium"
                        onClick={() => removeSpeaker(index)}
                        sx={{ color: "#999" }}
                      >
                        <Delete fontSize="medium" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              <Button
                size="medium"
                endIcon={<Add />}
                onClick={addSpeaker}
                sx={{
                  color: "white",
                  bgcolor: "text.secondary",
                  textTransform: "none",
                  fontSize: "16px",
                  padding: "8px 16px",
                  borderRadius: "0px",
                  width: "130px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Add
              </Button>
            </Box>

            {/* Key Highlights */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                Key Highlights
              </Typography>
              {formData.keyHighlights.map((highlight, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="..."
                      value={highlight}
                      onChange={(e) =>
                        handleHighlightChange(index, e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0px",
                          color: "white",
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#999",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        },
                      }}
                    />
                    {formData.keyHighlights.length > 1 && (
                      <IconButton
                        size="medium"
                        onClick={() => removeHighlight(index)}
                        sx={{ color: "#999" }}
                      >
                        <Delete fontSize="medium" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              <Button
                size="medium"
                endIcon={<Add />}
                onClick={addHighlight}
                sx={{
                  color: "white",
                  bgcolor: "text.secondary",
                  textTransform: "none",
                  fontSize: "16px",
                  padding: "8px 16px",
                  borderRadius: "0px",
                  width: "130px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Add
              </Button>
            </Box>

            {/* Sponsors */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                Sponsors
              </Typography>
              {formData.sponsors.map((sponsor, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={4}>
                      <TextField
                        fullWidth
                        size="medium"
                        placeholder="Name"
                        value={sponsor.name}
                        onChange={(e) =>
                          handleSponsorChange(index, "name", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "0px",
                            color: "white",
                            bgcolor: "#333",
                            "& fieldset": {
                              borderColor: "#555",
                            },
                            "&:hover fieldset": {
                              borderColor: "#777",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#999",
                            },
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "#999",
                            opacity: 1,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={2}>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          color: "white",
                          borderColor: "text.secondary",
                          bgcolor: "text.secondary",
                          textTransform: "none",
                          fontSize: "16px",
                          borderRadius: "0px",
                          width: "180px",
                        }}
                      >
                        Upload logo
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleSponsorChange(index, "logo", file);
                            }
                          }}
                        />
                      </Button>
                      {/* Preview of uploaded logo */}
                    </Grid>
                    <Grid size={4}>
                      {sponsor.logo && (
                        <Box mt={1}>
                          <img
                            src={
                              sponsor.logo instanceof File
                                ? URL.createObjectURL(sponsor.logo)
                                : sponsor.logo
                            }
                            alt="Sponsor Logo Preview"
                            style={{
                              maxWidth: "120px",
                              maxHeight: "60px",
                              border: "1px solid #444",
                              marginTop: 4,
                              background: "#222",
                            }}
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid size={1}>
                      {formData.sponsors.length > 1 && (
                        <IconButton
                          size="medium"
                          onClick={() => removeSponsor(index)}
                          sx={{ color: "#999" }}
                        >
                          <Delete fontSize="medium" />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                size="medium"
                endIcon={<Add />}
                onClick={addSponsor}
                sx={{
                  color: "white",
                  bgcolor: "text.secondary",
                  textTransform: "none",
                  fontSize: "16px",
                  padding: "8px 16px",
                  borderRadius: "0px",
                  width: "130px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Add Tickets Section */}
          <Box sx={{ p: "24px", mt: 10, bgcolor: "#0D0D0D" }}>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                mb: 2,
              }}
            >
              Add Tickets
            </Typography>

            {/* Ticket type */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "14px" }}>
                Ticket type
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControlLabel
                  sx={{
                    bgcolor: "#252525",
                    width: "175px",
                  }}
                  label={
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      Paid
                    </Typography>
                  }
                  control={
                    <Checkbox
                      checked={formData.ticketTypes[0] === "Paid"}
                      onChange={() =>
                        handleInputChange("ticketTypes", ["Paid"])
                      }
                      size="medium"
                      sx={{
                        color: "#999",
                        "&.Mui-checked": {
                          color: "white",
                        },
                      }}
                    />
                  }
                />
                <FormControlLabel
                  sx={{
                    bgcolor: "#252525",
                    width: "175px",
                  }}
                  control={
                    <Checkbox
                      checked={formData.ticketTypes[0] === "Free"}
                      onChange={() =>
                        handleInputChange("ticketTypes", ["Free"])
                      }
                      size="medium"
                      sx={{
                        color: "#999",
                        "&.Mui-checked": {
                          color: "white",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      Free
                    </Typography>
                  }
                />
              </Box>
            </Box>

            {/* Price per ticket and Stars to be earned */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {formData.ticketTypes[0] === "Paid" && (
                <Grid size={6}>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                    Price per ticket
                  </Typography>
                  <TextField
                    fullWidth
                    size="medium"
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) =>
                      handleInputChange(
                        "ticketPrice",
                        parseInt(e.target.value) || 0
                      )
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0px",
                        color: "white",
                        bgcolor: "#333",
                        "& fieldset": {
                          borderColor: "#555",
                        },
                        "&:hover fieldset": {
                          borderColor: "#777",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#999",
                        },
                      },
                    }}
                  />
                </Grid>
              )}

              <Grid size={6}>
                <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                  Stars to be earned
                </Typography>
                <TextField
                  fullWidth
                  size="medium"
                  type="number"
                  value={formData.starsToBeEarned}
                  onChange={(e) =>
                    handleInputChange(
                      "starsToBeEarned",
                      parseInt(e.target.value) || 0
                    )
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0px",
                      color: "white",
                      bgcolor: "#333",
                      "& fieldset": {
                        borderColor: "#555",
                      },
                      "&:hover fieldset": {
                        borderColor: "#777",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#999",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Link for registration */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "12px" }}>
                Link for registration
              </Typography>
              <TextField
                fullWidth
                size="medium"
                placeholder="..."
                value={formData.registrationLink}
                onChange={(e) =>
                  handleInputChange("registrationLink", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    color: "white",
                    bgcolor: "#333",
                    "& fieldset": {
                      borderColor: "#555",
                    },
                    "&:hover fieldset": {
                      borderColor: "#777",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#999",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 6,
            justifyContent: "flex-end",
          }}
        >
          <GreenButton onClick={handleSaveToDrafts} disabled={loading}>
            {loading ? "Saving..." : "Save To Drafts"}
          </GreenButton>
          <GreenButton
            onClick={handlePublish}
            disabled={loading}
            sx={{ bgcolor: "#0D0D0D", color: "white" }}
          >
            {loading ? "Publishing..." : "Publish"}
          </GreenButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default EventFormPage;
