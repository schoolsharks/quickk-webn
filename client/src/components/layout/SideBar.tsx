import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
  useTheme,
} from "@mui/material";
import {
  Home as DashboardIcon,
  SmartToy as BotIcon,
  QuestionAnswer as SchoolIcon,
  CardGiftcard as RewardsIcon,
  Person as TargetAudienceIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/header/logo.webp";
import AnimateOnState from "../../animation/AnimateOnState";
import { movingBorderVariants } from "../../animation/variants/movingBorder";
import { baseTransition } from "../../animation/transitions/baseTransition";
import { FeatureKeys } from "../../features/onboarding/Types/features";
import { useFeatureAccess } from "../../features/onboarding/hooks/useFeatureAccess";

const DRAWER_WIDTH = 264;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  feature?: FeatureKeys;
  children?: Array<{
    id: string;
    label: string;
    path: string;
    feature?: FeatureKeys;
  }>;
  isNewFeature?: boolean; // New prop to mark new features
}

const menuItems: MenuItem[] = [
  {
    id: "quickkAi",
    label: "Quickk AI",
    icon: <BotIcon />,
    path: "/admin/quickk-ai",
    isNewFeature: false, // Mark as new feature
    feature: FeatureKeys.QUICKKAI,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/admin/impact-dashboard",
  },
  {
    id: "learnings",
    label: "Learnings",
    icon: <SchoolIcon />,
    children: [
      {
        id: "modules",
        label: "Modules",
        path: "/admin/learnings/modules",
        feature: FeatureKeys.MODULES,
      },
      {
        id: "daily-pulse",
        label: "Daily interaction",
        path: "/admin/learnings/dailyInteraction",
        feature: FeatureKeys.DAILYPULSE,
      },
    ],
  },
  {
    id: "rewards",
    label: "Rewards",
    icon: <RewardsIcon />,
    path: "/admin/rewards",
    feature: FeatureKeys.REWARDS,
  },
];

const otherMenuItems: MenuItem[] = [
  {
    id: "target-audience",
    label: "Members",
    icon: <TargetAudienceIcon />,
    path: "/admin/users/single-upload",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <AnalyticsIcon />,
    path: "/admin/analytics",
    feature: FeatureKeys.ANALYTICS,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    path: "/admin/settings",
  },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
  variant?: "permanent" | "persistent" | "temporary";
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  open = true,
  onClose,
  variant = "permanent",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFeatureAccess } = useFeatureAccess();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "target-audience",
  ]);

  const filteredMenuItems = menuItems.filter(
    (item) => hasFeatureAccess(item.feature) || !item.feature
  );

  const filteredOtherMenuItems = otherMenuItems.filter((item) =>
    hasFeatureAccess(item.feature)
  );

  const handleItemClick = (item: MenuItem) => {
    // Only allow Target Audience to be clickable
    if (item.id !== "target-audience") {
      return; // Prevent interaction with disabled items
    }

    if (item.children) {
      const isExpanded = expandedItems.includes(item.id);
      if (isExpanded) {
        setExpandedItems(expandedItems.filter((id) => id !== item.id));
      } else {
        setExpandedItems([...expandedItems, item.id]);
      }
      // Don't navigate if item has children - only toggle dropdown
      return;
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleChildClick = (path: string) => {
    navigate(path);
  };

  const isActiveItem = (path?: string) => {
    // Only allow Target Audience sub-items to be active
    if (
      path &&
      (path.includes("/admin/users/single-upload") ||
        path.includes("/admin/users/bulk-upload"))
    ) {
      return path && location.pathname === path;
    }
    return false; // Disable all other menu items
  };

  const isItemDisabled = (item: MenuItem) => {
    // Only Target Audience is enabled, everything else is disabled
    return item.id !== "target-audience";
  };

  const isActiveParent = (item: MenuItem) => {
    if (item.children) {
      // Only Target Audience should be active, others are disabled
      if (item.id === "target-audience") {
        return true;
      }
      return false; // Disable all other menu items with children
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasFeatureAccess(item.feature)) {
      return null;
    }
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isActiveItem(item.path) || isActiveParent(item);
    const isDisabled = isItemDisabled(item);

    const accessibleChildren = item.children?.filter(
      (child) => !child.feature || hasFeatureAccess(child.feature)
    );

    return (
      <React.Fragment key={item.id}>
        {item.isNewFeature ? (
          <AnimateOnState
            variants={movingBorderVariants}
            transition={baseTransition}
            animateKey={`${item.id}-${Date.now()}`}
          >
            <Box
              sx={{
                borderRadius: "12px",
                padding: "1px",
              }}
            >
              <ListItem
                disablePadding
                sx={{
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.9)"
                    : "transparent",
                  borderRadius: "8px",
                  mb: 1,
                }}
              >
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  disabled={isDisabled}
                  sx={{
                    minHeight: 48,
                    borderRadius: "8px",
                    px: 2.5,
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: isActive
                      ? "1px solid rgba(160, 74, 212, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    color: isDisabled
                      ? "rgba(107, 33, 168, 0.5)"
                      : isActive
                      ? "#6B21A8"
                      : "#FFFFFF",
                    "&:hover": {
                      backgroundColor: isDisabled
                        ? "rgba(255, 255, 255, 0.1)"
                        : isActive
                        ? "rgba(255, 255, 255, 0.95)"
                        : "rgba(255, 255, 255, 0.2)",
                      border: isDisabled
                        ? "1px solid rgba(255, 255, 255, 0.2)"
                        : "1px solid rgba(160, 74, 212, 0.4)",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.6,
                      cursor: "not-allowed",
                    },
                    mx: 1,
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      mr: 2,
                      p: "7.5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      bgcolor: isDisabled
                        ? "rgba(107, 33, 168, 0.2)"
                        : isActive
                        ? "#A04AD4"
                        : "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        fontSize: "20px",
                        color: "#FFFFFF",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Box>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        {item.label}
                        {/* {item.isNewFeature && (
                          <Box
                            component="span"
                            sx={{
                              ml: 2,
                              px: 1,
                              py: 0.2,
                              bgcolor: "#96FF43",
                              color: "#222",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: 0.5,
                            }}
                          >
                            NEW
                          </Box>
                        )} */}
                      </Box>
                    }
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: 400,
                        fontSize: "14px",
                      },
                    }}
                  />
                  {item.children &&
                    (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
            </Box>
          </AnimateOnState>
        ) : (
          <Box
            sx={{
              borderRadius: "6px",
              padding: "2px",
            }}
          >
            <ListItem
              disablePadding
              sx={{
                // borderRadius: "8px",
                mb: 1,
              }}
            >
              <ListItemButton
                onClick={() => handleItemClick(item)}
                // disabled={isDisabled}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  color: "black",
                  "&.Mui-disabled": {
                    cursor: "not-allowed",
                  },
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "black",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      fontSize: "14px",
                      color: "#FFFFFF",
                      "& svg": {
                        fontSize: "20px",
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Box>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      {item.label}
                    </Box>
                  }
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: 400,
                      fontSize: "14px",
                    },
                  }}
                />
                {item.children &&
                  (isExpanded ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
          </Box>
        )}

        {accessibleChildren && accessibleChildren.length > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {accessibleChildren.map((child) => (
                <ListItem key={child.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleChildClick(child.path)}
                    sx={{
                      pl: 6,
                      pr: 2.5,
                      height: 32,
                      backgroundColor: isActiveItem(child.path)
                        ? "rgba(255, 255, 255, 0.8)"
                        : "rgba(255, 255, 255, 0.05)",
                      color: isActiveItem(child.path) ? "#6B21A8" : "#FFFFFF",
                      "&:hover": {
                        backgroundColor: isActiveItem(child.path)
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.15)",
                      },
                      borderRadius: 1,
                      mx: 2,
                      mb: 0.5,
                      border: isActiveItem(child.path)
                        ? "1px solid rgba(160, 74, 212, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        color: isActiveItem(child.path)
                          ? "#6B21A8"
                          : "rgba(255, 255, 255, 0.8)",
                      }}
                    ></ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: isActiveItem(child.path) ? 600 : 400,
                          fontSize: "13px",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const theme = useTheme();

  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        overflowX: "hidden",
        height: "100%",
        background: "#EACDFC",
        border: `1px solid ${theme.palette.primary.main}`,
        boxShadow: "5px 0px 90px 11px #CD7BFF inset",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: "30px", mx: "auto", width: "max-content" }}>
        <Box component={"img"} width={"84px"} src={logo} alt="" />
      </Box>

      <Box
        flex={1}
        mx={"8px"}
        height={"1px"}
        mb={"20px"}
        sx={{
          background:
            "linear-gradient(90deg, rgba(205, 123, 255, 0.3) 0%, #A04AD4 49.52%, rgba(205, 123, 255, 0.3) 99.04%)",
        }}
      />

      {/* Main Menu Items */}
      <List sx={{ px: 1 }}> {filteredMenuItems.map(renderMenuItem)}</List>

      {/* Divider and Other Section */}
      <Box sx={{ px: 5, pt: 3, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "black",
            letterSpacing: "0.5px",
          }}
        >
          OTHER
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>{filteredOtherMenuItems.map(renderMenuItem)}</List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "background.default",
          borderRight: "1px solid rgba(160, 74, 212, 0.12)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;
