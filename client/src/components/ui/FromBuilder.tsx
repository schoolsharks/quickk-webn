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
    backgroundColor: "#333",
    borderRadius: "0",
    "& .MuiOutlinedInput-root": {
      borderRadius: "0",
      color: "white",
      "& fieldset": { borderColor: "#444", borderRadius: "0" },
      "&:hover fieldset": { borderColor: "#666" },
      "&.Mui-focused fieldset": { borderColor: "#96FF43" },
    },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiSelect-icon": { color: "white" },
    "& .MuiInputBase-root": {
      borderRadius: "0",
    },
  };

  const renderField = (field: FieldConfig) => {
    const value = data[field.name] || field.defaultValue || "";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
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
                "& .MuiSvgIcon-root": { color: "white" },
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
                control={<Radio sx={{ color: "white" }} />}
                label={<Typography color="white">{option.label}</Typography>}
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
            sx={{ color: "white" }}
          />
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => onChange(field.name, e.target.checked)}
                sx={{ color: "white" }}
              />
            }
            label={field.label}
            sx={{ color: "white" }}
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
                  backgroundColor: "#96FF43",
                  color: "black",
                  "&:hover": { backgroundColor: "#7BD932" },
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

        return (
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  color: "white",
                  borderRadius: "0",
                },
                "& .Mui-selected": {
                  color: "#96FF43",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#96FF43",
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
                  // value={e}
                  key={value}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(field.name, file);
                    }
                  }}
                  style={{
                    padding: "12px",
                    backgroundColor: "#333",
                    border: "1px solid #444",
                    borderRadius: "0",
                    color: "white",
                    width: "100%",
                  }}
                />
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  value={value}
                  placeholder={field.placeholder || "Enter image URL"}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  sx={{ ...defaultFieldStyle, ...fieldStyle }}
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
                  background: editor?.isActive("bold") ? "#96FF43" : "#444",
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
                  background: editor?.isActive("italic") ? "#96FF43" : "#444",
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
                    ? "#96FF43"
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
            <Typography variant="h6" color="white" sx={{ mb: 1 }}>
              {field.label}
              {field.required && <span style={{ color: "#ff4444" }}> *</span>}
            </Typography>
          )}
          {renderField(field)}
        </Box>
      ))}
    </Box>
  );
};

export default FormBuilder;
