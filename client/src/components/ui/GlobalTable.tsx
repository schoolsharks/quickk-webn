import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  //   Chip,
  Box,
  Typography,
  //   LinearProgress,
  Menu,
  MenuItem,
  useTheme,
  //   Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  //   Edit as EditIcon,
  //   Delete as DeleteIcon,
  //   Visibility as ViewIcon,
} from "@mui/icons-material";

// Define the structure for table columns
export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string | React.ReactNode;
  sortable?: boolean;
}

// Define the structure for action buttons
export interface ActionButton {
  icon: React.ReactNode;
  label: string;
  onClick: (row: any) => void;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

// Define the props for the GlobalTable component
export interface GlobalTableProps {
  columns: TableColumn[];
  data: any[];
  title?: string;
  showActions?: boolean;
  actionButtons?: ActionButton[];
  showDownload?: boolean;
  onDownload?: () => void;
  dense?: boolean;
  maxHeight?: number;
  stickyHeader?: boolean;
}

const GlobalTable: React.FC<GlobalTableProps> = ({
  columns,
  data,
  title,
  showActions = false,
  actionButtons = [],
  showDownload = false,
  onDownload,
  dense = false,
  maxHeight = 440,
  stickyHeader = true,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  const handleActionClick = (
    event: React.MouseEvent<HTMLElement>,
    row: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionItemClick = (action: ActionButton) => {
    action.onClick(selectedRow);
    handleActionClose();
  };

  // Format cell value based on column configuration
  const formatCellValue = (column: TableColumn, value: any) => {
    if (column.format) {
      return column.format(value);
    }
    return value;
  };
  const theme = useTheme();

  return (
    <Box
      sx={{ backgroundColor: theme.palette.background.default }}
      p={"24px 28px"}
    >
      {/* Header */}
      {(title || showDownload) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {title && <Typography variant="h4">{title}</Typography>}
          {showDownload && onDownload && (
            <IconButton onClick={onDownload} sx={{ color: "white" }}>
              <DownloadIcon />
            </IconButton>
          )}
        </Box>
      )}

      {/* Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight }}>
          <Table stickyHeader={stickyHeader} size={dense ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      py: "10px",
                      color: "rgba(160, 174, 192, 1)",
                      fontWeight: 500,
                      fontSize: "10px",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell
                    align="center"
                    sx={{
                      py: "10px",
                      backgroundColor: theme.palette.background.default,
                      color: "rgba(160, 174, 192, 1)",
                      fontWeight: 500,
                      fontSize: "10px",
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow hover key={index} sx={{ p: "10px" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      {formatCellValue(column, row[column.id])}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell
                      align="center"
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      <IconButton
                        onClick={(event) => handleActionClick(event, row)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {actionButtons.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleActionItemClick(action)}
            sx={{ gap: 1 }}
          >
            {action.icon}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default GlobalTable;
