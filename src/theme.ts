import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c60ff'
    },
    secondary: {
      main: '#0f766e'
    },
    background: {
      default: '#eef3fb',
      paper: 'rgba(255,255,255,0.88)'
    },
    text: {
      primary: '#102a43',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(', '),
    h1: { fontWeight: 700, letterSpacing: '-0.04em' },
    h2: { fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 }
  },
  shape: {
    borderRadius: 20
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 14
        }
      }
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          background: 'transparent'
        }
      }
    }
  }
});

export default theme;
