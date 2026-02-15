import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// MUI imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a dark theme (you can tweak colors later)
const theme = createTheme({
  palette: {
    mode: 'dark', // Dark theme
    primary: {
      main: '#1db954', // Cool green
    },
    secondary: {
      main: '#191414', // Dark accent
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets default browser styles */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
