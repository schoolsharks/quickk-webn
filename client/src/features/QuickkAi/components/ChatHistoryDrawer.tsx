import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Input,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ChatBubbleOutline as ChatIcon,
  School as ModuleIcon,
  Today as PulseIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import GreenButton from "../../../components/ui/GreenButton";
import { ChatHistoryDrawerProps, Message } from "../types/interfaces";

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  open,
  onClose,
  onChatSelect,
  onNewChat,
  chats,
  loading,
  onDeleteChat,
  onArchiveChat,
  onSearchChats,
}) => {
  const navigate = useNavigate();
  const { chatId: currentChatId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeoutId = setTimeout(() => {
      onSearchChats(value);
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
    navigate(`/admin/quickk-ai/${chatId}`);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    navigate("/admin/quickk-ai");
    onClose();
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    chatId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedChatId(chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChatId(null);
  };

  const handleDeleteChat = async () => {
    if (selectedChatId) {
      try {
        await onDeleteChat(selectedChatId);
        setSnackbar({
          open: true,
          message: "Chat deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete chat",
          severity: "error",
        });
      }
      handleMenuClose();
    }
  };

  const handleArchiveChat = async () => {
    if (selectedChatId) {
      try {
        await onArchiveChat(selectedChatId);
        setSnackbar({
          open: true,
          message: "Chat archived successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to archive chat",
          severity: "error",
        });
      }
      handleMenuClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getChatTypeIcon = (chatType: string) => {
    switch (chatType) {
      case "module":
        return <ModuleIcon sx={{ color: "primary.main" }} />;
      case "dailyPulse":
        return <PulseIcon sx={{ color: "primary.main" }} />;
      default:
        return <ChatIcon sx={{ color: "primary.main" }} />;
    }
  };

  const getChatTypeColor = (chatType: string) => {
    switch (chatType) {
      case "module":
        return "primary.main";
      case "dailyPulse":
        return "#4FC3F7";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "archived":
        return "#FF9800";
      case "active":
      default:
        return "#2196F3";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLastMessage = (messages: Message[]) => {
    if (messages.length === 0) return "No messages";
    const lastMessage = messages[messages.length - 1];

    // Truncate message if too long
    const maxLength = 60;
    if (lastMessage.content.toString().length > maxLength) {
      return lastMessage.content.toString().substring(0, maxLength) + "...";
    }

    return lastMessage.content;
  };

  const getLastMessageSender = (messages: Message[]) => {
    if (messages.length === 0) return "";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.sender === "bot" ? "AI: " : "You: ";
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            backgroundColor: "black",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chat History
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* New Chat Button */}
          <Box sx={{ p: 2 }}>
            <GreenButton
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleNewChat}
            >
              New Chat
            </GreenButton>
          </Box>

          {/* Search */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Input
              fullWidth
              placeholder="Search chats..."
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              }
            />
          </Box>

          <Divider />

          {/* Chat List */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress size={40} sx={{ color: "primary.main" }} />
              </Box>
            ) : (
              <List sx={{ height: "100%", overflow: "auto", p: 0 }}>
                {chats.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      color: "#9e9e9e",
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body2">
                      {searchTerm ? "No chats found" : "No chats yet"}
                    </Typography>
                  </Box>
                ) : (
                  chats.map((chat, index) => (
                    <React.Fragment key={chat._id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleChatSelect(chat._id)}
                          selected={currentChatId === chat._id}
                          sx={{
                            py: 1.5,
                            px: 2,
                            "&.Mui-selected": {
                              borderRight: `3px solid primary.main`,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor:
                                  getChatTypeColor(chat.chatType) + "20",
                              }}
                            >
                              {getChatTypeIcon(chat.chatType)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 500,
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {chat.title}
                                </Typography>
                                <Chip
                                  label={chat.status}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    backgroundColor:
                                      getStatusColor(chat.status) + "20",
                                    color: getStatusColor(chat.status),
                                    fontWeight: 500,
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#666",
                                    display: "block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {getLastMessageSender(chat.messages)}
                                  {getLastMessage(chat.messages)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#999",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {formatDate(chat.updatedAt)}
                                </Typography>
                              </Box>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, chat._id)}
                            sx={{ ml: 1 }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                      {index < chats.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))
                )}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          mt: 1,
          minWidth: 150,
        }}
      >
        <MenuItem onClick={handleArchiveChat}>
          <ArchiveIcon sx={{ mr: 1, fontSize: 20 }} />
          Archive
        </MenuItem>
        <MenuItem onClick={handleDeleteChat}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatHistoryDrawer;
