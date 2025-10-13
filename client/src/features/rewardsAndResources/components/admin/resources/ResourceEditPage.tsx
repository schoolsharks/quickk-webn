import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Roles } from "../../../../auth/authSlice";
import { RootState } from "../../../../../app/store";
import dayjs, { Dayjs } from "dayjs";
import {
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  CompanySearchResult,
} from "../../../rewardsAndResourcesApi";
import ResourceBasicDetails from "./ResourceBasicDetails";
import ResourceCompanyDetails from "./ResourceCompanyDetails";
import ResourceRewardDetails from "./ResourceRewardDetails";
import ResourceCriteria from "./ResourceCriteria";
import ResourceReminders from "./ResourceReminders";
import ResourcePreview from "./ResourcePreview";
import GreenButton from "../../../../../components/ui/GreenButton";

interface ResourceFormData {
  heading: string;
  subHeading: string;
  image: string | File;
  type: "SERVICE" | "PRODUCT";
  targetAudience: string[];
  companyName: string;
  companyLogo: string | File;
  companyEmail: string;
  companyContact: string;
  description: {
    title: string;
    points: string[];
  }[];
  stars: number;
  quantity: number;
  expiryDate: Dayjs;
  status: "ACTIVE" | "DRAFT";
}

const ResourceEditPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(resourceId);

  // Get user role for button text
  const role = useSelector((state: RootState) => state.auth.role);
  const isSuperAdmin = role === Roles.SUPER_ADMIN;

  // API hooks
  const { data: resourceData, isLoading: isLoadingResource } =
    useGetResourceByIdQuery(resourceId!, { skip: !isEditMode });
  const [createResource, { isLoading: isCreating }] =
    useCreateResourceMutation();
  const [updateResource, { isLoading: isUpdating }] =
    useUpdateResourceMutation();

  // Form state
  const [formData, setFormData] = useState<ResourceFormData>({
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
    expiryDate: dayjs().add(30, "day"),
    status: "DRAFT",
  });

  // Email management state
  const [selectedEmailDestination, setSelectedEmailDestination] = useState<
    "user" | "company"
  >("company");
  const [userEmailAddress, setUserEmailAddress] = useState("");

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && resourceData?.data) {
      const resource = resourceData.data;
      setFormData({
        heading: resource.heading || "",
        subHeading: resource.subHeading || "",
        image: resource.image || "",
        type: ((resource as any).type as "SERVICE" | "PRODUCT") || "SERVICE",
        targetAudience: (resource as any).targetAudience || ["All"],
        companyName: resource.companyName || "",
        companyLogo: (resource as any).companyLogo || "",
        companyEmail: (resource as any).companyEmail || "",
        companyContact: (resource as any).companyContact || "",
        description: resource.description?.length
          ? resource.description
          : [
              { title: "What's included", points: [""] },
              { title: "Perfect For", points: [""] },
              { title: "Add ons (at extra cost)", points: [""] },
              { title: "Note", points: [""] },
            ],
        stars: resource.stars || 0,
        quantity: (resource as any).quantity || 150,
        expiryDate: dayjs((resource as any).expiryDate || new Date()),
        status: ((resource as any).status as "ACTIVE" | "DRAFT") || "DRAFT",
      });
    }
  }, [isEditMode, resourceData]);

  // Update form data
  const updateFormData = (updates: Partial<ResourceFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Handle company selection
  const handleCompanySelect = (company: CompanySearchResult) => {
    setUserEmailAddress(company.companyMail);
  };

  // Handle form submission
  const handleSubmit = async (status: "ACTIVE" | "DRAFT") => {
    try {
      // Only validate required fields when publishing (status === "ACTIVE")
      if (status === "ACTIVE") {
        const requiredFields = [
          { field: "heading", label: "Title" },
          { field: "subHeading", label: "Offer" },
          { field: "image", label: "Logo" },
          { field: "companyName", label: "Company Name" },
          // {
          //   field: "stars",
          //   label: "Stars Needed To Redeem",
          //   validator: (value: number) => value > 0,
          // },
          // {
          //   field: "quantity",
          //   label: "Quantity",
          //   validator: (value: number) => value > 0,
          // },
          // { field: "expiryDate", label: "Expiry Date" },
        ];

        const missingFields = requiredFields.filter(({ field
          // , validator
         }) => {
          const value = formData[field as keyof ResourceFormData];
          // if (validator) {
          //   return !validator(value as number);
          // }
          if (field === "image" || field === "companyLogo") {
            return !value || (typeof value === "string" && !value.trim());
          }
          return !value || (typeof value === "string" && !value.trim());
        });

        if (missingFields.length > 0) {
          const fieldNames = missingFields.map(({ label }) => label).join(", ");
          alert(
            `Please fill in the following required fields before publishing: ${fieldNames}`
          );
          return;
        }

        // Validate description sections when publishing
        const hasEmptyDescriptions = formData.description.some(
          (section) =>
            !section.title.trim() ||
            section.points.some((point) => !point.trim())
        );

        if (hasEmptyDescriptions) {
          alert(
            "Please fill in all description section titles and points before publishing."
          );
          return;
        }
      }

      // Check if we have file uploads
      const hasFileUploads =
        formData.image instanceof File || formData.companyLogo instanceof File;

      let submitData: any;

      if (hasFileUploads) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();

        // Add basic fields
        formDataToSend.append("heading", formData.heading);
        formDataToSend.append("subHeading", formData.subHeading);
        formDataToSend.append("type", formData.type);
        formDataToSend.append(
          "targetAudience",
          JSON.stringify(formData.targetAudience)
        );
        formDataToSend.append("companyName", formData.companyName);
        formDataToSend.append(
          "companyEmail",
          selectedEmailDestination === "user"
            ? userEmailAddress
            : formData.companyEmail
        );
        formDataToSend.append("companyContact", formData.companyContact);
        formDataToSend.append(
          "description",
          JSON.stringify(formData.description)
        );
        formDataToSend.append("stars", formData.stars.toString());
        formDataToSend.append("quantity", formData.quantity.toString());
        formDataToSend.append("expiryDate", formData.expiryDate.toISOString());
        formDataToSend.append("status", status);

        // Handle image uploads
        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        } else if (typeof formData.image === "string" && formData.image) {
          formDataToSend.append("image", formData.image);
        }

        if (formData.companyLogo instanceof File) {
          formDataToSend.append("companyLogo", formData.companyLogo);
        } else if (
          typeof formData.companyLogo === "string" &&
          formData.companyLogo
        ) {
          formDataToSend.append("companyLogo", formData.companyLogo);
        }

        submitData = formDataToSend;
      } else {
        // Use regular JSON for text-only updates
        submitData = {
          ...formData,
          status,
          expiryDate: formData.expiryDate.toISOString(),
          companyEmail:
            selectedEmailDestination === "user"
              ? userEmailAddress
              : formData.companyEmail,
        };
      }

      let result;
      if (isEditMode) {
        result = await updateResource({
          resourceId: resourceId!,
          resourceData: submitData,
        }).unwrap();
      } else {
        result = await createResource(submitData).unwrap();
      }

      // If creating new resource, redirect to edit page
      if (!isEditMode && result.data) {
        navigate(`/admin/resources/edit/${result.data._id}`);
      } else {
        navigate("/admin/rewards-and-resources");
      }
    } catch (error: any) {
      console.error("Error saving resource:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to save resource";
      alert(`Error: ${errorMessage}`);
    }
  };

  if (isLoadingResource) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box px={3}>
        <Box sx={{ backgroundColor: "#000", minHeight: "100vh", p: 3 }}>
          <Stack spacing={3}>
            {/* Basic Details */}
            <ResourceBasicDetails
              formData={{
                heading: formData.heading,
                subHeading: formData.subHeading,
                image: formData.image,
                type: formData.type,
                targetAudience: formData.targetAudience,
              }}
              onFormDataChange={updateFormData}
            />

            {/* Company Details */}
            <ResourceCompanyDetails
              formData={{
                companyName: formData.companyName,
                companyLogo: formData.companyLogo,
                companyEmail: formData.companyEmail,
                companyContact: formData.companyContact,
                image: formData.image,
              }}
              onFormDataChange={updateFormData}
              onCompanySelect={handleCompanySelect}
            />

            {/* Reward Details */}
            <ResourceRewardDetails
              description={formData.description}
              onDescriptionChange={(description) =>
                updateFormData({ description })
              }
            />

            {/* Reward Criteria */}
            <ResourceCriteria
              stars={formData.stars}
              onStarsChange={(stars) => updateFormData({ stars })}
              selectedEmailDestination={selectedEmailDestination}
              onEmailDestinationChange={setSelectedEmailDestination}
              userEmail={userEmailAddress}
              companyEmail={formData.companyEmail}
            />

            {/* Reminders */}
            <ResourceReminders
              quantity={formData.quantity}
              onQuantityChange={(quantity) => updateFormData({ quantity })}
              expiryDate={formData.expiryDate}
              onExpiryDateChange={(expiryDate) =>
                updateFormData({ expiryDate })
              }
            />
            {/* Action Buttons */}
          </Stack>
        </Box>
        <Box display="flex" gap={2} mt={2} px={2} justifyContent="flex-end">
          <GreenButton
            onClick={() => handleSubmit("DRAFT")}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? "Saving..." : "Save To Drafts"}
          </GreenButton>
          <GreenButton
            onClick={() => handleSubmit("ACTIVE")}
            disabled={isCreating || isUpdating}
            sx={{ bgcolor: "#0D0D0D", color: "white" }}
          >
            {isCreating || isUpdating ? "Publishing..." : isSuperAdmin ? "Publish" : "Send for Review"}
          </GreenButton>
        </Box>

        <Box mt={4}>
          <ResourcePreview
            formData={{
              heading: formData.heading,
              subHeading: formData.subHeading,
              image: formData.image,
              stars: formData.stars,
              companyName: formData.companyName,
              description: formData.description,
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ResourceEditPage;
