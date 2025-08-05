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
      type: "textarea",
      required: true,
      placeholder: "Enter address",
      rows: 3,
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

  return (
    <Box
      sx={{
        background: "black",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          backgroundColor: "#1a1a1a",
          borderRadius: 2,
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
            backgroundColor: "#1a1a1a",
          }}
        />

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
    </Box>
  );
};

export default ReviewUser;
