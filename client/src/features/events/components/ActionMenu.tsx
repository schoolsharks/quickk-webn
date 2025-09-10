import React from 'react';
import { 
  Popover, 
  Paper, 
  MenuList, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  IconButton,
  Box
} from '@mui/material';
import { Instagram, Facebook, Email, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface RecommendationUser {
  _id: string;
  name: string;
  businessName: string;
  businessLogo?: string;
  businessCategory?: string;
  specialisation?: string;
  chapter?: string;
  instagram?: string;
  facebook?: string;
  companyMail: string;
  avatar?: string;
  matchScore: number;
}

interface ActionMenuProps {
  user: RecommendationUser;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ user, anchorEl, onClose }) => {
  const theme = useTheme();

  const generateInstagramMessage = (user: RecommendationUser) => {
    return `Hi ${user.name}! 👋 I found your profile through our community network and I'm impressed by your work in ${user.businessCategory || 'your field'}. I'd love to connect and explore potential collaborations! ${user.businessName ? `Your business "${user.businessName}" looks amazing.` : ''} Looking forward to hearing from you! 🚀`;
  };

  const generateFacebookMessage = (user: RecommendationUser) => {
    return `Hello ${user.name},\n\nI hope this message finds you well. I came across your profile through our community network and was impressed by your work${user.businessCategory ? ` in ${user.businessCategory}` : ''}.\n\n${user.businessName ? `I particularly admire "${user.businessName}" and ` : 'I '}would love to connect and explore potential opportunities for collaboration or knowledge sharing.\n\n${user.specialisation ? `I see we both have interests in ${user.specialisation}, which makes me even more excited about the possibility of connecting.` : ''}\n\nLooking forward to your response!\n\nBest regards`;
  };

  const generateEmailMessage = (user: RecommendationUser) => {
    const subject = `Connection Request from Community Network${user.businessName ? ` - Interest in ${user.businessName}` : ''}`;
    const body = `Dear ${user.name},\n\nI hope this email finds you well. My name is [Your Name] and I discovered your profile through our community network.\n\n${user.businessName ? `I'm very impressed by "${user.businessName}"` : 'I\'m impressed by your professional background'}${user.businessCategory ? ` and your work in ${user.businessCategory}` : ''}. ${user.specialisation ? `I noticed we share similar interests in ${user.specialisation}, ` : ''}and I believe there could be valuable opportunities for us to connect and collaborate.\n\n${user.chapter ? `I see you're part of ${user.chapter}, which makes our potential connection even more meaningful within our community.` : ''}\n\nI would love to schedule a brief conversation to:\n• Learn more about your business and current projects\n• Share insights from my own experience\n• Explore potential collaboration opportunities\n• Build meaningful professional relationships within our network\n\nWould you be available for a quick call or coffee meeting in the coming weeks? I'm flexible with timing and can work around your schedule.\n\nThank you for considering this connection request. I look forward to hearing from you soon.\n\nBest regards,\n[Your Name]\n[Your Contact Information]`;
    
    return { subject, body };
  };

  const handleInstagramClick = () => {
    if (user.instagram) {
      const instagramHandle = user.instagram.replace('@', '').replace('https://instagram.com/', '').replace('https://www.instagram.com/', '');
      const message = generateInstagramMessage(user);
      
      // Copy message to clipboard
      navigator.clipboard.writeText(message);
      
      // Open Instagram profile
      const instagramWebUrl = `https://www.instagram.com/${instagramHandle}`;
      window.open(instagramWebUrl, '_blank');
    }
    onClose();
  };

  const handleFacebookClick = () => {
    if (user.facebook) {
      const message = generateFacebookMessage(user);
      
      // Extract Facebook username/ID from URL
      let facebookId = user.facebook;
      if (user.facebook.includes('facebook.com/')) {
        facebookId = user.facebook.split('facebook.com/')[1].split('/')[0];
      }
      
      // Copy message to clipboard
      navigator.clipboard.writeText(message);
      
      // Open Facebook profile
      const facebookUrl = `https://www.facebook.com/${facebookId}`;
      window.open(facebookUrl, '_blank');
    }
    onClose();
  };

  const handleEmailClick = () => {
    const { subject, body } = generateEmailMessage(user);
    const mailtoUrl = `mailto:${user.companyMail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 0,
            minWidth: 220,
            border: `1px solid ${theme.palette.divider}`,
          }
        }
      }}
    >
      <Paper>
        {/* Header */}
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          p={2}
          borderBottom={1}
          borderColor={theme.palette.divider}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Connect with {user.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <MenuList sx={{ py: 1 }}>
          <MenuItem 
            onClick={handleInstagramClick}
            disabled={!user.instagram}
            sx={{
              '&:hover': user.instagram ? {
                bgcolor: '#E91E63' + '10',
                '& .MuiListItemIcon-root': { color: '#E91E63' },
                '& .MuiListItemText-primary': { color: '#E91E63' }
              } : {}
            }}
          >
            <ListItemIcon>
              <Instagram sx={{ color: user.instagram ? 'inherit' : theme.palette.text.disabled }} />
            </ListItemIcon>
            <ListItemText 
              primary="Instagram" 
              secondary={!user.instagram ? "(Not available)" : undefined}
            />
          </MenuItem>

          <MenuItem 
            onClick={handleFacebookClick}
            disabled={!user.facebook}
            sx={{
              '&:hover': user.facebook ? {
                bgcolor: '#1877F2' + '10',
                '& .MuiListItemIcon-root': { color: '#1877F2' },
                '& .MuiListItemText-primary': { color: '#1877F2' }
              } : {}
            }}
          >
            <ListItemIcon>
              <Facebook sx={{ color: user.facebook ? 'inherit' : theme.palette.text.disabled }} />
            </ListItemIcon>
            <ListItemText 
              primary="Facebook" 
              secondary={!user.facebook ? "(Not available)" : undefined}
            />
          </MenuItem>

          <MenuItem 
            onClick={handleEmailClick}
            sx={{
              '&:hover': {
                bgcolor: theme.palette.success.main + '10',
                '& .MuiListItemIcon-root': { color: theme.palette.success.main },
                '& .MuiListItemText-primary': { color: theme.palette.success.main }
              }
            }}
          >
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText primary="Email" />
          </MenuItem>
        </MenuList>

        {/* Footer note */}
        <Divider />
        <Box p={2}>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            Messages will be copied to clipboard for your convenience
          </Typography>
        </Box>
      </Paper>
    </Popover>
  );
};

export default ActionMenu;
