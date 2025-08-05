import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";

interface GlobalButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    fullWidth?: boolean;
    sx?: object;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({
    onClick,
    disabled,
    onKeyDown,
    children,
    fullWidth = true,
    sx = {},
}) => {
    const theme = useTheme();
    return (
        <Button
            variant="contained"
            type="submit"
            fullWidth={fullWidth}
            onClick={onClick}
            disabled={disabled}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onClick();
                }
                onKeyDown?.(e);
            }}
            sx={{
                bgcolor: theme.palette.primary.main,
                color: "black",
                borderRadius: "0px",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "24px",
                padding: "16px 12px",
                ...sx,
            }}
        >
            {children}
        </Button>
    );
};

export default GlobalButton;