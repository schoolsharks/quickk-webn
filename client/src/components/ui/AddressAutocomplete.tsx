import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Popper,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useAddressAutocomplete } from '../../hooks/useAddressAutocomplete';
import { AddressAutocompleteProps, AddressOption } from '../../types/address';

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Start typing address...",
  disabled = false,
  error = false,
  helperText,
  size = "medium",
  sx = {},
}) => {
  const { suggestions, isLoading, error: searchError, searchAddress, clearSuggestions } = useAddressAutocomplete();
  const [inputValue, setInputValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<AddressOption | null>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input change
  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    onChange(newInputValue); // Always update parent with current input
    
    // Search for suggestions
    if (newInputValue.trim()) {
      searchAddress(newInputValue);
    } else {
      clearSuggestions();
    }
  };

  // Handle option selection
  const handleChange = (_event: React.SyntheticEvent, newValue: string | AddressOption | null) => {
    // Handle string input (when user types freely)
    if (typeof newValue === 'string') {
      setInputValue(newValue);
      onChange(newValue);
      return;
    }
    
    // Handle option selection
    const option = newValue as AddressOption | null;
    setSelectedOption(option);
    
    if (option) {
      const fullAddress = option.fullAddress;
      setInputValue(fullAddress);
      onChange(fullAddress, option); // Pass both address string and full data
      clearSuggestions(); // Clear suggestions after selection
    }
  };

  // Custom Popper to match your theme
  const CustomPopper = (props: any) => (
    <Popper
      {...props}
      sx={{
        '& .MuiPaper-root': {
          bgcolor: '#333',
          border: '1px solid #555',
          borderRadius: '0px',
          color: 'white',
        },
      }}
    />
  );

  // Custom Paper component for dropdown
  const CustomPaper = (props: any) => (
    <Paper
      {...props}
      sx={{
        bgcolor: '#333',
        border: '1px solid #555',
        borderRadius: '0px',
        color: 'white',
        '& .MuiAutocomplete-listbox': {
          '& .MuiAutocomplete-option': {
            color: 'white',
            '&:hover': {
              bgcolor: '#444',
            },
            '&[aria-selected="true"]': {
              bgcolor: '#555 !important',
            },
          },
        },
      }}
    />
  );

  return (
    <Autocomplete
      freeSolo
      value={selectedOption}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={suggestions}
      loading={isLoading}
      disabled={disabled}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.fullAddress;
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={(options) => options} // Don't filter, use API results as-is
      noOptionsText={
        inputValue.length < 3 
          ? "Type at least 3 characters..." 
          : searchError 
            ? "Error loading suggestions"
            : "No addresses found"
      }
      PopperComponent={CustomPopper}
      PaperComponent={CustomPaper}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size={size}
          error={error || !!searchError}
          helperText={helperText || searchError}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && (
                  <CircularProgress 
                    size={16} 
                    sx={{ color: '#999', mr: 1 }} 
                  />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            ...sx,
            "& .MuiOutlinedInput-root": {
              color: "white",
              borderRadius: "0px",
              bgcolor: "#333",
              "& fieldset": {
                borderColor: error || searchError ? "#ff6b6b" : "#555",
              },
              "&:hover fieldset": {
                borderColor: error || searchError ? "#ff6b6b" : "#777",
              },
              "&.Mui-focused fieldset": {
                borderColor: error || searchError ? "#ff6b6b" : "#999",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#999",
              opacity: 1,
            },
            "& .MuiFormHelperText-root": {
              color: error || searchError ? "#ff6b6b" : "#999",
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1,
            px: 2,
            color: 'white',
            '&:hover': {
              bgcolor: '#444',
            },
          }}
        >
          <LocationOn sx={{ color: '#999', fontSize: 20 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {option.mainText}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#ccc',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {option.secondaryText}
            </Typography>
          </Box>
        </Box>
      )}
      sx={{
        '& .MuiAutocomplete-clearIndicator': {
          color: '#999',
        },
        '& .MuiAutocomplete-popupIndicator': {
          color: '#999',
        },
      }}
    />
  );
};

export default AddressAutocomplete;