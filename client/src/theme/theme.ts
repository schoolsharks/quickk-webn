import { createTheme } from '@mui/material/styles';


const baseTheme = createTheme({
  palette: {
    // White-label palette based on provided design tokens
    // Primary family (purple)
    mode: 'light',
    primary: {
      // Brand primary
      main: '#A04AD4', // provided
      light: '#CD7BFF', // provided (lighter accent)
      // dark omitted intentionally to stick to provided tokens
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#CA93E4', // complementary brand tint
      contrastText: '#252525',
    },
    background: {
      // Page background
      default: '#F7F0FB', // provided page BG
      paper: '#FFFFFF', // cards/surfaces on light theme
    },
    text: {
      primary: '#252525', // provided
      secondary: '#404040', // provided
    },
  },
  typography: {
    fontFamily: '"Red Hat Display",  sans-serif',
    fontSize:16,
    h1: {
      fontWeight: 700,
      fontSize: '30px',
    },
    h2: {
      fontWeight: 600,
      fontSize: "30px",
    },
    button: {
      fontWeight: 500,
      fontSize: '16px',
    },
    h3: {
      fontWeight: 400,
      fontSize: '10px',
    },
    h4: {
      fontWeight: 700,
      fontSize: '20px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '20px',  

    },
    h6: {
      fontWeight: 600,
      fontSize: '12px',
    },
    subtitle1: {
      fontSize: '50px',
      fontWeight: 900,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontWeight: 600,
      fontSize: '16px',  
    },
    body2: {
      fontWeight: 500,
      fontSize: '16px', 
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

export const theme = baseTheme;
