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
import logo from "../../assets/images/header/logo.png";
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
    isNewFeature: true, // Mark as new feature
    feature: FeatureKeys.QUICKKAI,
  },
  {
    id: "dashboard",
    label: "Impact Dashboard",
    icon: <DashboardIcon />,
    path: "/admin/impact-dashboard",
  },
  {
    id: "learnings",
    label: "Content",
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
    label: "Target Audience",
    icon: <TargetAudienceIcon />,
    path: "/admin/users",
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
  const [expandedItems, setExpandedItems] = useState<string[]>(["learnings"]);

  const filteredMenuItems = menuItems.filter(
    (item) => hasFeatureAccess(item.feature) || !item.feature
  );

  const filteredOtherMenuItems = otherMenuItems.filter((item) =>
    hasFeatureAccess(item.feature)
  );

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      const isExpanded = expandedItems.includes(item.id);
      if (isExpanded) {
        setExpandedItems(expandedItems.filter((id) => id !== item.id));
      } else {
        setExpandedItems([...expandedItems, item.id]);
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleChildClick = (path: string) => {
    navigate(path);
  };

  const isActiveItem = (path?: string) => {
    return path && location.pathname === path;
  };

  const isActiveParent = (item: MenuItem) => {
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasFeatureAccess(item.feature)) {
      return null;
    }
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isActiveItem(item.path) || isActiveParent(item);

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
                    ? "rgba(37, 37, 37, 1)"
                    : "background.default",
                  borderRadius: "4px",
                }}
              >
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  sx={{
                    minHeight: 48,
                    borderRadius: "4px",
                    px: 2.5,
                    backgroundColor: isActive
                      ? "rgba(37, 37, 37, 1)"
                      : "transparent",
                    boxShadow: " 0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)",
                    color: isActive ? "primary.main" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "rgba(37, 37, 37, 1)"
                        : "rgba(150, 255, 67, 0.08)",
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
                      borderRadius: "2px",
                      bgcolor: isActive
                        ? "primary.main"
                        : "rgba(37, 37, 37, 1)",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        fontSize: "14px",
                        color: isActive
                          ? "rgba(13, 13, 13, 1)"
                          : "primary.main",
                        "& svg": {
                          fontSize: "15px",
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
                        {item.isNewFeature && (
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
                        )}
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
                backgroundColor: isActive
                  ? "rgba(37, 37, 37, 1)"
                  : "background.default",
                borderRadius: "4px",
              }}
            >
              <ListItemButton
                onClick={() => handleItemClick(item)}
                sx={{
                  minHeight: 48,
                  borderRadius: "4px",
                  px: 2.5,
                  backgroundColor: isActive
                    ? "rgba(37, 37, 37, 1)"
                    : "transparent",
                  boxShadow: " 0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)",
                  color: isActive ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "rgba(37, 37, 37, 1)"
                      : "rgba(150, 255, 67, 0.08)",
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
                    borderRadius: "2px",
                    bgcolor: isActive ? "primary.main" : "rgba(37, 37, 37, 1)",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      fontSize: "14px",
                      color: isActive ? "rgba(13, 13, 13, 1)" : "primary.main",
                      "& svg": {
                        fontSize: "15px",
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
                        ? "rgba(37, 37, 37, 1)"
                        : "transparent",
                      color: isActiveItem(child.path)
                        ? "primary.main"
                        : "text.secondary",
                      "&:hover": {
                        backgroundColor: isActiveItem(child.path)
                          ? "rgba(37, 37, 37, 1)"
                          : "rgba(37, 37, 37, 1)",
                      },
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        color: isActiveItem(child.path)
                          ? "#000000"
                          : "text.secondary",
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

  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        overflowX: "hidden",
        height: "100%",
        backgroundColor: "background.default",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: "30px", mx: "auto", width: "max-content" }}>
        <Box component={"img"} width={"84px"} src={logo} alt="" />
      </Box>

      <Box
        flex={1}
        mx={"16px"}
        height={"1px"}
        mb={"20px"}
        sx={{
          background:
            "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
        }}
      ></Box>

      {/* Main Menu Items */}
      <List sx={{ px: 1 }}> {filteredMenuItems.map(renderMenuItem)}</List>

      {/* Divider and Other Section */}
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: "12px",
            fontWeight: 500,
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
          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;
