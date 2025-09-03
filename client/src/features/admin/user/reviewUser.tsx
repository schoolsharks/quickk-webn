import React, { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useAddEditUserMutation } from "../service/adminApi";
import FormBuilder, { FieldConfig } from "../../../components/ui/FromBuilder";
import GreenButton from "../../../components/ui/GreenButton";
import { useNavigate } from "react-router-dom";

// User data interface
export interface UserFormData {
  _id: string;
  companyMail: string;
  name: string;
  contact: string;
  address: string;
  chapter: string;
  businessName: string;
  instagram: string;
  facebook: string;
  businessCategory: string;
  specialisation: string;
}

// Props interface for the component
export interface UserFormPageProps {
  userData?: UserFormData; // Optional - if provided, form is in edit mode
}

const ReviewUser: React.FC<UserFormPageProps> = ({ userData }) => {
  const [addEditUser, { isLoading }] = useAddEditUserMutation();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    _id: "",
    companyMail: "",
    name: "",
    contact: "",
    address: "",
    chapter: "",
    businessName: "",
    instagram: "",
    facebook: "",
    businessCategory: "",
    specialisation: "",
  });

  // Alert state for success/error messages
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Initialize form data if editing
  useEffect(() => {
    if (userData) {
      const isTemporaryEmail = userData.companyMail.startsWith("UNDEFINED_");
      setFormData({
        _id: userData._id,
        companyMail: isTemporaryEmail ? "" : userData.companyMail || "",
        name: userData.name === "New User" ? "" : userData.name || "",
        contact: userData.contact || "",
        address: userData.address || "",
        chapter: userData.chapter || "",
        businessName: userData.businessName || "",
        instagram: userData.instagram || "",
        facebook: userData.facebook || "",
        businessCategory: userData.businessCategory || "",
        specialisation: userData.specialisation || "",
      });
    }
  }, [userData]);

  // Form field configuration
  const formFields: FieldConfig[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter full name",
      validation: {
        message: "Name is required",
      },
    },
    {
      name: "companyMail",
      label: "Company Email",
      type: "text",
      required: true,
      placeholder: "Enter company email address",
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
    {
      name: "contact",
      label: "Contact Number",
      type: "text",
      required: true,
      placeholder: "Enter 10-digit contact number",
      validation: {
        pattern: /^\d{10}$/,
        message: "Contact number must be exactly 10 digits",
      },
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
      placeholder: "Enter address",
    },
    {
      name: "chapter",
      label: "Chapter",
      type: "text",
      required: false,
      placeholder: "Enter chapter name",
    },
    {
      name: "businessName",
      label: "Business Name",
      type: "text",
      required: false,
      placeholder: "Enter business name",
    },
    {
      name: "instagram",
      label: "Instagram Handle",
      type: "text",
      required: false,
      placeholder: "Enter Instagram handle (e.g., @username)",
    },
    {
      name: "facebook",
      label: "Facebook Profile/Page",
      type: "text",
      required: false,
      placeholder: "Enter Facebook URL",
    },
    {
      name: "businessCategory",
      label: "Business Category",
      type: "text",
      required: false,
      placeholder: "Enter business category",
    },
    {
      name: "specialisation",
      label: "Specialisation",
      type: "text",
      required: false,
      placeholder: "Enter area of specialisation",
    },
  ];

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear alerts when user starts typing
    if (alert.show) {
      setAlert({ show: false, type: "success", message: "" });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.name.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Name is required",
      });
      return false;
    }

    if (!formData.companyMail.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Company email is required",
      });
      return false;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.companyMail)) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a valid email address",
      });
      return false;
    }

    // Validate contact if provided
    if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
      setAlert({
        show: true,
        type: "error",
        message: "Contact number must be exactly 10 digits",
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addEditUser({
        userId: formData._id,
        companyMail: formData.companyMail,
        name: formData.name,
        contact: formData.contact,
        address: formData.address,
        chapter: formData.chapter,
        businessName: formData.businessName,
        instagram: formData.instagram,
        facebook: formData.facebook,
        businessCategory: formData.businessCategory,
        specialisation: formData.specialisation,
      })
        .unwrap()
        .then(() => {
          setAlert({
            show: true,
            type: "success",
            message: userData
              ? "User updated successfully!"
              : "User created successfully!",
          });
          navigate("/admin/users");
        });
    } catch (error: any) {
      console.error("Error saving user:", error);
      setAlert({
        show: true,
        type: "error",
        message:
          error?.data?.message || "Failed to save user. Please try again.",
      });
    }
  };
  // const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "80vw",
          mx: "auto",
          backgroundColor: "white",
          borderRadius: 0,
          p: 4,
        }}
      >
        {/* Page Header */}
        <Typography
          variant="h4"
          sx={{
            color: "white",
            mb: 3,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {userData ? "Edit User" : "Add New User"}
        </Typography>

        {/* Alert Messages */}
        {alert.show && (
          <Alert
            severity={alert.type}
            sx={{
              mb: 3,
              borderRadius: 0,
              "& .MuiAlert-message": {
                color: alert.type === "error" ? "#ff4444" : "#4caf50",
              },
            }}
            onClose={() =>
              setAlert({ show: false, type: "success", message: "" })
            }
          >
            {alert.message}
          </Alert>
        )}

        {/* Form */}
        <FormBuilder
          fields={formFields}
          data={formData}
          onChange={handleFieldChange}
          containerStyle={{
            backgroundColor: "white",
          }}
        />
      </Box>
      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <GreenButton onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? !userData?.companyMail.startsWith("UNDEFINED_")
              ? "Updating..."
              : "Creating..."
            : !userData?.companyMail.startsWith("UNDEFINED_")
            ? "Update User"
            : "Add User"}
        </GreenButton>
      </Box>
    </Box>
  );
};

export default ReviewUser;
