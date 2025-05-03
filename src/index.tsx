import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from "@mui/material/styles" // Импорт провайдера темы и функции создания темы для Material UI.
import { BrowserRouter } from "react-router-dom" // Импорт маршрутизатора для управления навигацией.
import { ruRU } from "@mui/material/locale"
import "./index.css" // Импорт глобальных стилей приложения.

const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#4fbc8b", // пастельно-зелёный, свежий
        contrastText: "#fff",
      },
      secondary: {
        main: "#6ec6ff", // светло-голубой, акцент
      },
      background: {
        default: "#e6ebe6", // светлый зелёный
        paper: "#c7d9ca",    // светло-голубой для карточек
      },
      text: {
        primary: "#23443a", // тёмно-зелёный для основного текста
        secondary: "#4a6572", // серо-зелёный для второстепенного
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: [
        "Montserrat",
        "Roboto",
        "Arial",
        "sans-serif",
      ].join(","),
      h6: {
        fontWeight: 700,
        letterSpacing: 1,
        color: "#23443a",
      },
      body1: {
        color: "#23443a",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(76,175,80,0.15)",
            },
          },
          containedPrimary: {
            backgroundColor: "#4fbc8b",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: "#f5fafd",
            boxShadow: "0 6px 16px rgba(76, 175, 80, 0.10)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: "0 8px 24px rgba(76, 175, 80, 0.12)",
            backgroundColor: "#f5fafd",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#4fbc8b",
            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.18)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#23443a",
          },
        },
      },
    },
  },
  ruRU
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    {/* Обеспечиваем маршрутизацию для приложения. */}
    <ThemeProvider theme={theme}>
      {/* Обеспечиваем доступность темы для всех вложенных компонентов. */}
      <App />
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
