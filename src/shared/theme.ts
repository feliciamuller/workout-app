import { createTheme } from '@mui/material';
import { Colors } from './colors';

export const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Manrope',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'transparent',
          color: '#000',
          '&:hover': {
            fontWeight: 'bold',
          },
        },
      },
    },
  },
});
