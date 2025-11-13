import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Checkbox,
  Button,
  Tab,
  Tabs,
} from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "switch"
  | "checkbox"
  | "number"
  | "date"
  | "array"
  | "image"
  | "richtext"; // ✅ New type added

export interface SelectOption {
  value: string;
  label: string;
}

export interface RadioOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[] | RadioOption[]; // For select and radio
  rows?: number; // For textarea
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
  arrayConfig?: {
    maxItems?: number;
    itemLabel?: string;
    itemPlaceholder?: string;
  };
}

interface DynamicFormBuilderProps {
  fields: FieldConfig[];
  data: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
  containerStyle?: React.CSSProperties;
  fieldStyle?: React.CSSProperties;
}

const FormBuilder: React.FC<DynamicFormBuilderProps> = ({
  fields,
  data,
  onChange,
  containerStyle,
  fieldStyle,
}) => {
  const defaultFieldStyle = {
    backgroundColor: "white",
    borderRadius: "0",
    color: "black",
    "& .MuiOutlinedInput-root": {
      borderRadius: "0",
      // border: "1px solid #464646",
      color: "black",
      "& fieldset": { borderRadius: "0" },
      // "&:hover fieldset": { borderColor: "#464646" },
      // "&.Mui-focused fieldset": { borderColor: "464646" },
    },
    "& .MuiInputLabel-root": { color: "black" },
    "& .MuiSelect-icon": { color: "black" },
    "& .MuiInputBase-root": {
      borderRadius: "0",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  };

  const renderField = (field: FieldConfig) => {
    const value = data[field.name] || field.defaultValue || "";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
            variant="outlined"
            fullWidth
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.name, e.target.value)}
            sx={{ ...defaultFieldStyle, ...fieldStyle }}
          />
        );

      case "textarea":
        return (
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={field.rows || 3}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.name, e.target.value)}
            sx={{ ...defaultFieldStyle, ...fieldStyle }}
          />
        );

      case "date":
        return (
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            value={value}
            placeholder={field.placeholder || "Enter date"}
            onChange={(e) => onChange(field.name, e.target.value)}
            sx={{ ...defaultFieldStyle, ...fieldStyle }}
          />
        );

      case "select":
        return (
          <FormControl fullWidth>
            <Select
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              sx={{
                ...defaultFieldStyle,
                ...fieldStyle,
                border: "1px solid #464646",
                "& .MuiSvgIcon-root": { color: "black" },
                "& .MuiInputBase-root": {
                  borderRadius: "0",
                },
              }}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "radio":
        return (
          <RadioGroup
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio sx={{ color: "black" }} />}
                label={<Typography color="black">{option.label}</Typography>}
              />
            ))}
          </RadioGroup>
        );

      case "switch":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => onChange(field.name, e.target.checked)}
                color="success"
                sx={{
                  "& .MuiButtonBase-root": {
                    borderRadius: 0,
                  },
                }}
              />
            }
            label={field.label}
            sx={{ color: "black" }}
          />
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => onChange(field.name, e.target.checked)}
                sx={{ color: "black" }}
              />
            }
            label={field.label}
            sx={{ color: "black" }}
          />
        );

      case "array":
        const arrayValue = Array.isArray(value) ? value : [];
        const maxItems = field.arrayConfig?.maxItems || 10;

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {arrayValue.map((item: string, index: number) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  value={item}
                  placeholder={
                    field.arrayConfig?.itemPlaceholder ||
                    `${field.arrayConfig?.itemLabel || "Item"} ${index + 1}`
                  }
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    onChange(field.name, newArray);
                  }}
                  sx={{ ...defaultFieldStyle, ...fieldStyle }}
                />
                <Button
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    onChange(field.name, newArray);
                  }}
                  sx={{
                    color: "#ff4444",
                    minWidth: "auto",
                    p: 1,
                    borderRadius: "0",
                  }}
                >
                  ×
                </Button>
              </Box>
            ))}
            {arrayValue.length < maxItems && (
              <Button
                onClick={() => {
                  const newArray = [...arrayValue, ""];
                  onChange(field.name, newArray);
                }}
                sx={{
                  backgroundColor: "primary.main",
                  color: "black",
                  "&:hover": { backgroundColor: "primary.dark" },
                  alignSelf: "flex-start",
                  borderRadius: "0",
                }}
              >
                Add {field.arrayConfig?.itemLabel || "Item"}
              </Button>
            )}
          </Box>
        );

      case "image":
        const [tabValue, setTabValue] = React.useState(0);
        const [previewUrl, setPreviewUrl] = React.useState<string>("");

        React.useEffect(() => {
          if (value instanceof File) {
            // Create preview URL for uploaded file
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);

            // Cleanup function to revoke the URL
            return () => URL.revokeObjectURL(url);
          } else if (typeof value === "string" && value.trim()) {
            // Use the URL string directly
            setPreviewUrl(value);
          } else {
            setPreviewUrl("");
          }
        }, [value]);

        return (
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  color: "#666",
                  borderRadius: "0",
                  minHeight: "36px",
                },
                "& .Mui-selected": {
                  color: "#000",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary",
                },
              }}
            >
              <Tab label="Upload File" />
              <Tab label="Image URL" />
            </Tabs>

            {tabValue === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  key={value instanceof File ? value.name : ""}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(field.name, file);
                    }
                  }}
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "0",
                    color: "#333",
                    width: "100%",
                    fontSize: "14px",
                  }}
                />

                {/* File Upload Preview */}
                {value instanceof File && (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#666", mb: 1, display: "block" }}
                    >
                      Selected file: {value.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={typeof value === "string" ? value : ""}
                  placeholder={field.placeholder || "Enter image URL"}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  sx={{ ...defaultFieldStyle, ...fieldStyle }}
                />
              </Box>
            )}

            {/* Image Preview */}
            {previewUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#666", mb: 1, display: "block" }}
                >
                  Preview:
                </Typography>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  onError={() => {
                    console.warn("Failed to load image:", previewUrl);
                    setPreviewUrl(""); // Clear preview on error
                  }}
                  sx={{
                    maxWidth: 200,
                    maxHeight: 200,
                    objectFit: "contain",
                    border: "2px solid #ddd",
                    borderRadius: 0,
                    backgroundColor: "#f5f5f5",
                    p: 1,
                    display: "block",
                  }}
                />
              </Box>
            )}
          </Box>
        );

      case "richtext":
        const editor = useEditor({
          extensions: [StarterKit, Link],
          content: value || "", // initial content
          onUpdate: ({ editor }) => {
            onChange(field.name, editor.getHTML());
          },
        });

        useEffect(() => {
          if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
          }
        }, [value, editor]);

        return (
          <Box
            sx={{
              border: "1px solid #444",
              padding: "8px",
              borderRadius: "0",
              backgroundColor: "#333",
              color: "white",
            }}
          >
            <Box sx={{ mb: 1 }}>
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                style={{
                  background: editor?.isActive("bold") ? "primary.main" : "#444",
                  color: editor?.isActive("bold") ? "black" : "white",
                  marginRight: 4,
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Bold
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                style={{
                  background: editor?.isActive("italic") ? "primary.main" : "#444",
                  color: editor?.isActive("italic") ? "black" : "white",
                  marginRight: 4,
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Italic
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                style={{
                  background: editor?.isActive("bulletList")
                    ? "primary.main"
                    : "#444",
                  color: editor?.isActive("bulletList") ? "black" : "white",
                  marginRight: 4,
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Bullet
              </button>
            </Box>

            <EditorContent editor={editor} style={{ minHeight: "150px" }} />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        ...containerStyle,
      }}
    >
      {fields.map((field) => (
        <Box key={field.name}>
          {field.type !== "switch" && field.type !== "checkbox" && (
            <Typography variant="h6" color="black" sx={{ mb: 1 }}>
              {field.label}
              {field.required && <span style={{ color: "black" }}> *</span>}
            </Typography>
          )}
          {renderField(field)}
        </Box>
      ))}
    </Box>
  );
};

export default FormBuilder;
